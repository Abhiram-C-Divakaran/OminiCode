import { db } from '../firebase';
import { collection, doc, getDocs, onSnapshot, query, where, orderBy, limit, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const ORG_ID = 'default';

export interface Environment {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: 'HEALTHY' | 'DEGRADED' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'UNKNOWN';
  lastHeartbeat: number;
}

export interface MetricSample {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: number;
}

export interface PipelineRun {
  id: string;
  provider: string;
  repositoryId: string;
  branch: string;
  commitSha: string;
  commitMessage: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'SKIPPED' | 'WAITING' | 'MANUAL_APPROVAL';
  startedAt: number;
  completedAt: number;
  duration: string;
  environment: string;
}

export interface LogEvent {
  id: string;
  environmentId: string;
  timestamp: number;
  message: string;
  severity: string;
  source: string;
}

export const DevOpsService = {
  subscribeToEnvironments(callback: (envs: Environment[]) => void) {
    const colRef = collection(db, 'organizations', ORG_ID, 'environments');
    return onSnapshot(colRef, (snapshot) => {
      const envs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Environment));
      callback(envs);
    });
  },

  subscribeToEnvironmentTelemetry(envId: string, callback: (metrics: MetricSample | null) => void) {
    const docRef = doc(db, 'organizations', ORG_ID, 'environments', envId, 'telemetry', 'latest');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as MetricSample);
      } else {
        callback(null);
      }
    });
  },

  subscribeToPipelineRuns(callback: (runs: PipelineRun[]) => void) {
    const colRef = collection(db, 'organizations', ORG_ID, 'pipeline_runs');
    const q = query(colRef, orderBy('startedAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const runs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PipelineRun));
      callback(runs);
    });
  },

  subscribeToLogs(envId: string | null, callback: (logs: LogEvent[]) => void) {
    const colRef = collection(db, 'organizations', ORG_ID, 'logs');
    let q = query(colRef, orderBy('timestamp', 'desc'), limit(100));
    
    if (envId) {
      q = query(colRef, where('environmentId', '==', envId), orderBy('timestamp', 'desc'), limit(100));
    }

    return onSnapshot(q, (snapshot) => {
      // Reverse so oldest is first for log terminal
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LogEvent)).reverse();
      callback(logs);
    });
  },

  async triggerPipeline(repositoryId: string, branch: string, environment: string) {
    const res = await fetch('/api/devops/pipelines/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repositoryId,
        branch,
        environment
      })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to trigger pipeline');
    }
    return res.json();
  }
};
