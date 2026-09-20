const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  const orgId = "default";
  
  const environments = [
    { id: 'prod-1', name: 'Production Node', type: 'KUBERNETES_CLUSTER', endpoint: '10.0.1.5', status: 'HEALTHY', lastHeartbeat: Date.now() },
    { id: 'stg-1', name: 'Staging Gateway', type: 'GATEWAY', endpoint: '10.0.1.8', status: 'HEALTHY', lastHeartbeat: Date.now() },
    { id: 'qa-1', name: 'QA Sandboxes', type: 'VM', endpoint: '10.0.2.14', status: 'DEGRADED', lastHeartbeat: Date.now() - 60000 },
    { id: 'dev-1', name: 'Local Dev Proxy', type: 'LOCAL_AGENT', endpoint: 'localhost:3000', status: 'OFFLINE', lastHeartbeat: Date.now() - 3600000 },
  ];

  for (const env of environments) {
    await setDoc(doc(db, 'organizations', orgId, 'environments', env.id), env);
    await setDoc(doc(db, 'organizations', orgId, 'environments', env.id, 'telemetry', 'latest'), {
      cpu: Math.floor(Math.random() * 40) + 10,
      memory: Math.floor(Math.random() * 60) + 20,
      disk: Math.floor(Math.random() * 50) + 30,
      network: Math.floor(Math.random() * 100) + 50,
      timestamp: Date.now()
    });
  }

  const pipelines = [
    { id: 'CI-1094', provider: 'GitHub Actions', repositoryId: 'repo-1', branch: 'main', commitSha: 'f3a820a', commitMessage: 'Merge pull request #45', status: 'SUCCESS', startedAt: Date.now() - 3600000, completedAt: Date.now() - 3500000, duration: '1m 14s', environment: 'Production' },
    { id: 'CI-1093', provider: 'GitHub Actions', repositoryId: 'repo-1', branch: 'feature/auth', commitSha: 'a1b2c3d', commitMessage: 'Fix token validation', status: 'FAILED', startedAt: Date.now() - 7200000, completedAt: Date.now() - 7100000, duration: '45s', environment: 'Staging' },
    { id: 'CI-1092', provider: 'GitHub Actions', repositoryId: 'repo-1', branch: 'main', commitSha: '9f8e7d6', commitMessage: 'Update dependencies', status: 'SUCCESS', startedAt: Date.now() - 10800000, completedAt: Date.now() - 10700000, duration: '2m 10s', environment: 'Production' },
  ];

  for (const pipe of pipelines) {
    await setDoc(doc(db, 'organizations', orgId, 'pipeline_runs', pipe.id), pipe);
  }

  const logs = [
    { id: 'log-1', environmentId: 'prod-1', timestamp: Date.now() - 10000, message: 'Worker node initialized successfully.', severity: 'INFO', source: 'kubernetes' },
    { id: 'log-2', environmentId: 'prod-1', timestamp: Date.now() - 5000, message: 'Connection to database established.', severity: 'INFO', source: 'backend' },
    { id: 'log-3', environmentId: 'prod-1', timestamp: Date.now() - 1000, message: 'Request latency spike detected.', severity: 'WARN', source: 'gateway' },
  ];

  for (const log of logs) {
    await setDoc(doc(db, 'organizations', orgId, 'logs', log.id), log);
  }

  console.log("DevOps Seeding complete!");
  process.exit(0);
}

seed().catch(e => {
  console.error("Seeding failed", e);
  process.exit(1);
});
