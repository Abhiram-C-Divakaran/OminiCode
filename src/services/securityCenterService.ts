import { collection,doc,limit,onSnapshot,orderBy,query } from 'firebase/firestore';
import { db } from '../firebase';

export interface SecurityScoreMetrics {
  securityScore: number;
  securityScoreConfidence: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  newRegressions: number;
  repositoriesAtRisk: number;
  exposedSecrets: number;
  vulnerableDependencies: number;
  scanCoverage: number;
  slaViolations: number;
  meanTimeToRemediationHours: number;
  generatedAt: number;
}

export interface RepositoryRisk {
  id: string;
  name: string;
  ownerTeam: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'HEALTHY' | 'UNKNOWN';
  securityScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  secretsCount: number;
  dependencyRisk: string;
  coverage: number;
  lastScanAt: number;
  scanStatus: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  repositoryId: string;
  repositoryName: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  confidence: number;
  file: string;
  line: number;
  language: string;
  cwe: string;
  owasp: string;
  sourceEngine: string;
  team: string;
  environment: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'FIXED' | 'ACCEPTED_RISK' | 'FALSE_POSITIVE' | 'SUPPRESSED' | 'REOPENED';
  isNewRegression: boolean;
  assignee: string;
  dueAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  title: string;
  repositoryName: string;
  team: string;
  environment: string;
  findingId?: string;
  createdAt: number;
  status: string;
}

const ORG_ID = 'default';

export const SecurityCenterService = {
  subscribeToOverview(callback: (data: SecurityScoreMetrics | null) => void) {
    const docRef = doc(db, 'organizations', ORG_ID, 'metrics', 'overview');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as SecurityScoreMetrics);
      } else {
        callback(null);
      }
    });
  },

  subscribeToRepositories(callback: (repos: RepositoryRisk[]) => void) {
    const colRef = collection(db, 'organizations', ORG_ID, 'repositories');
    return onSnapshot(colRef, (snapshot) => {
      const repos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as RepositoryRisk));
      callback(repos);
    });
  },

  subscribeToFindings(callback: (findings: SecurityFinding[]) => void) {
    const colRef = collection(db, 'organizations', ORG_ID, 'findings');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const findings = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SecurityFinding));
      callback(findings);
    });
  },
  
  subscribeToEvents(callback: (events: SecurityEvent[]) => void, onError: () => void = () => {}) {
    const colRef = collection(db, 'organizations', ORG_ID, 'events');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(10));
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SecurityEvent));
      callback(events);
    }, onError);
  },

  subscribeToTrends(callback: (trends: { name: string; critical: number; high: number }[]) => void) {
    const docRef = doc(db, 'organizations', ORG_ID, 'metrics', 'trends');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data().data || []);
      } else {
        callback([]);
      }
    });
  }
};
