const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  const orgId = "default";
  
  // Organization
  await setDoc(doc(db, 'organizations', orgId), {
    name: "Acme Corp",
    createdAt: Date.now()
  });

  // Metrics
  await setDoc(doc(db, 'organizations', orgId, 'metrics', 'overview'), {
    securityScore: 82,
    securityScoreConfidence: 95,
    critical: 3,
    high: 12,
    medium: 45,
    low: 112,
    newRegressions: 2,
    repositoriesAtRisk: 4,
    exposedSecrets: 1,
    vulnerableDependencies: 8,
    scanCoverage: 91,
    slaViolations: 2,
    meanTimeToRemediationHours: 42,
    generatedAt: Date.now()
  });

  // Repositories
  const repos = [
    { id: "repo-1", name: "core-auth-service", ownerTeam: "Identity", riskLevel: "CRITICAL", securityScore: 65, criticalCount: 2, highCount: 5, mediumCount: 12, secretsCount: 1, dependencyRisk: "HIGH", coverage: 100, lastScanAt: Date.now(), scanStatus: "COMPLETED" },
    { id: "repo-2", name: "frontend-dashboard", ownerTeam: "Frontend", riskLevel: "MEDIUM", securityScore: 88, criticalCount: 0, highCount: 2, mediumCount: 15, secretsCount: 0, dependencyRisk: "LOW", coverage: 95, lastScanAt: Date.now() - 3600000, scanStatus: "COMPLETED" },
    { id: "repo-3", name: "payment-gateway", ownerTeam: "Finance", riskLevel: "HIGH", securityScore: 72, criticalCount: 1, highCount: 5, mediumCount: 8, secretsCount: 0, dependencyRisk: "MEDIUM", coverage: 100, lastScanAt: Date.now() - 7200000, scanStatus: "COMPLETED" }
  ];
  for (const repo of repos) {
    await setDoc(doc(db, 'organizations', orgId, 'repositories', repo.id), repo);
  }

  // Findings
  const findings = [
    { id: "find-1", title: "Hardcoded AWS Secret Key", repositoryId: "repo-1", repositoryName: "core-auth-service", severity: "critical", confidence: 99, file: "src/config/aws.ts", line: 42, language: "typescript", cwe: "CWE-798", sourceEngine: "TruffleHog", team: "Identity", environment: "Production", status: "OPEN", isNewRegression: true, assignee: "alice@acme.corp", createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000 },
    { id: "find-2", title: "SQL Injection in Login endpoint", repositoryId: "repo-1", repositoryName: "core-auth-service", severity: "critical", confidence: 95, file: "src/api/login.ts", line: 112, language: "typescript", cwe: "CWE-89", sourceEngine: "Semgrep", team: "Identity", environment: "Production", status: "IN_PROGRESS", isNewRegression: false, assignee: "bob@acme.corp", createdAt: Date.now() - 172800000, updatedAt: Date.now() - 86400000 },
    { id: "find-3", title: "Log4j Remote Code Execution", repositoryId: "repo-3", repositoryName: "payment-gateway", severity: "high", confidence: 100, file: "pom.xml", line: 24, language: "xml", cwe: "CWE-502", sourceEngine: "Dependabot", team: "Finance", environment: "Production", status: "OPEN", isNewRegression: false, assignee: "charlie@acme.corp", createdAt: Date.now() - 259200000, updatedAt: Date.now() - 259200000 }
  ];
  for (const finding of findings) {
    await setDoc(doc(db, 'organizations', orgId, 'findings', finding.id), finding);
  }

  // Events
  const events = [
    { id: "evt-1", type: "CRITICAL_FINDING", severity: "critical", title: "New critical vulnerability detected in core-auth-service", repositoryName: "core-auth-service", team: "Identity", environment: "Production", findingId: "find-1", createdAt: Date.now() - 3600000, status: "UNREAD" },
    { id: "evt-2", type: "SLA_BREACH", severity: "high", title: "SLA breached for 3 high severity findings in payment-gateway", repositoryName: "payment-gateway", team: "Finance", environment: "Production", createdAt: Date.now() - 86400000, status: "UNREAD" },
    { id: "evt-3", type: "SCAN_FAILED", severity: "medium", title: "Scheduled scan failed for legacy-api", repositoryName: "legacy-api", team: "Backend", environment: "Staging", createdAt: Date.now() - 172800000, status: "READ" }
  ];
  for (const evt of events) {
    await setDoc(doc(db, 'organizations', orgId, 'events', evt.id), evt);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(e => {
  console.error("Seeding failed", e);
  process.exit(1);
});
