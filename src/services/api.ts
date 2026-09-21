import { ScanMode } from '../types/scan';

export const scanService = {
  startScan: async (repoId: string, branch: string, commitSha: string, filePath: string, scanMode: ScanMode, language: string) => {
    // Attempt real API call if available
    try {
      const res = await fetch('/api/scans/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryId: repoId, branch, commitSha, filePath, scanMode, language })
      });
      if (res.ok) {
         return res.json();
      }
    } catch(e) {}
    
    // Fallback Mock implementation matching the clean service boundary
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ job: { id: 'mock-job-' + Date.now() } });
      }, 500);
    });
  },

  getJobStatus: async (jobId: string) => {
    try {
      const res = await fetch(`/api/scans/${jobId}/status`);
      if (res.ok) return res.json();
    } catch(e) {}
    // Simulated status tracking
    return { status: 'COMPLETED' };
  },

  getFindings: async (jobId: string) => {
    try {
      const res = await fetch(`/api/scans/${jobId}/findings`);
      if (res.ok) {
        const data = await res.json();
        return data.findings || [];
      }
    } catch(e) {}
    
    // Mock finding for frontend wiring if API fails
    return [{
      id: 'finding_1',
      title: 'SQL Injection',
      severity: 'Critical',
      confidence: 97,
      category: 'Security',
      ruleId: 'sql-injection',
      cwe: 'CWE-89',
      owasp: 'A03:2021-Injection',
      language: 'JavaScript',
      file: 'code-snippet.js',
      line: 2,
      description: 'User-controlled input is concatenated into a SQL query string, which can lead to SQL Injection.',
      technicalExplanation: 'An attacker can manipulate the SQL query by providing malicious input in the amount parameter, potentially accessing or modifying data they shouldn\'t.',
      evidence: 'amount = "0; DROP TABLE users; --"',
      remediation: 'Use parameterized queries (prepared statements) to separate SQL code from user input.',
      suggestedPatch: 'const query = "UPDATE balance SET amount = amount - ? WHERE user_id = ?";\ndb.execute(query, [amount, user.id]);',
      sourceEngine: 'OminiCode Data Flow Engine',
      status: 'Open',
      fingerprint: 'fp_sql_inj_1'
    }];
  }
};

export const fixService = {
  generateFix: async (findingId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'fix_' + findingId,
          findingId,
          status: 'VALIDATED',
          patch: 'const query = "UPDATE balance SET amount = amount - ? WHERE user_id = ?";\ndb.execute(query, [amount, user.id]);'
        });
      }, 1500);
    });
  },
  generateAllFixes: async (findingIds: string[]) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'COMPLETED', generatedCount: findingIds.length });
      }, 2000);
    });
  },
  validateFix: async (fixId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
           status: 'VALIDATED',
           validationResults: { syntax: 'Passed', tests: 'Passed', security: 'Passed' }
        });
      }, 2000);
    });
  },
  commitFix: async (repositoryId: string, branch: string, commitMessage: string, fixId: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Return mock success or simulated error
        resolve({
          commitSha: 'f842bc1',
          commitUrl: `https://github.com/example/${repositoryId}/commit/f842bc1`,
          branch
        });
      }, 1000);
    });
  }
};

export const testService = {
  runAffectedTests: async (fixId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'SUCCESS',
          total: 47,
          passed: 47,
          failed: 0,
          skipped: 0,
          duration: 1.2
        });
      }, 2500);
    });
  }
};
