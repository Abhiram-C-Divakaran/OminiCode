import { apiFetch } from "./api";
import { Finding,ScanMode } from '../types/scan';

export const scanService = {
  startScan: async (repositoryId: string, branch: string, commitSha: string, filePath: string, scanMode: ScanMode, language: string) => {
    // This simulates the POST /api/scans endpoint
    const response = await apiFetch('/api/scans/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repositoryId, branch, commitSha, filePath, scanMode, language })
    });
    if (!response.ok) throw new Error('Failed to start scan');
    return response.json();
  },
  
  getScanProgress: async (jobId: string) => {
    const response = await apiFetch(`/api/scans/${jobId}/status`);
    if (!response.ok) throw new Error('Failed to fetch scan progress');
    return response.json();
  },

  getFindings: async (jobId: string) => {
    const response = await apiFetch(`/api/scans/${jobId}/findings`);
    if (!response.ok) throw new Error('Failed to fetch findings');
    const data = await response.json();
    return data.findings as Finding[];
  }
};
