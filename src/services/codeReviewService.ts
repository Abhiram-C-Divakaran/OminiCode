import { db } from '../firebase';
import { collection, doc, getDocs, onSnapshot, query, where, orderBy, limit, addDoc, setDoc } from 'firebase/firestore';

const ORG_ID = 'default';

export const RepositoryService = {
  async getRepositories() {
    const res = await fetch('/api/repositories');
    return res.json();
  },
  async getBranches(repoId: string) {
    const res = await fetch(`/api/repositories/${repoId}/branches`);
    return res.json();
  },
  async getTree(repoId: string, path: string) {
    const res = await fetch(`/api/repositories/${repoId}/tree?path=${encodeURIComponent(path)}`);
    return res.json();
  },
  async getFile(repoId: string, branch: string, path: string) {
    const res = await fetch(`/api/repositories/${repoId}/file?branch=${encodeURIComponent(branch)}&path=${encodeURIComponent(path)}`);
    return res.json();
  }
};

export const ScanService = {
  async startScan(repoId: string, branch: string, commitSha: string, filePath: string, scanMode: string, languageMode: string) {
    const res = await fetch('/api/scans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repositoryId: repoId, branch, commitSha, filePath, scanMode, languageMode })
    });
    return res.json();
  },
  
  subscribeToScan(scanId: string, callback: (data: any) => void) {
    const docRef = doc(db, 'organizations', ORG_ID, 'scans', scanId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    });
  },

  subscribeToFindings(scanId: string, callback: (findings: any[]) => void) {
    const colRef = collection(db, 'organizations', ORG_ID, 'findings');
    const q = query(colRef, where('scanId', '==', scanId));
    return onSnapshot(q, (snapshot) => {
      const findings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(findings);
    });
  }
};

export const FixService = {
  async generateFix(findingId: string) {
    const res = await fetch(`/api/findings/${findingId}/generate-fix`, { method: 'POST' });
    return res.json();
  },
  
  subscribeToFix(fixId: string, callback: (data: any) => void) {
    const docRef = doc(db, 'organizations', ORG_ID, 'fixes', fixId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    });
  },
  
  async runTests(fixId: string) {
    const res = await fetch(`/api/fixes/${fixId}/tests`, { method: 'POST' });
    return res.json();
  }
};

