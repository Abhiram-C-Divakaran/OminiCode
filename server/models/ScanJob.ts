
export type ScanStatus = 'QUEUED' | 'INDEXING' | 'ANALYZING' | 'CORRELATING' | 'AI_REVIEW' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'CANCELLED';

export interface ScanJob {
    id: string;
    organizationId: string;
    repositoryId: string;
    branch: string;
    commitSha: string;
    status: ScanStatus;
    scanType: string;
    languages: string[];
    totalFiles: number;
    processedFiles: number;
    skippedFiles: number;
    failedFiles: number;
    findings: string[]; // Finding IDs
    startedAt: string;
    completedAt?: string;
}
