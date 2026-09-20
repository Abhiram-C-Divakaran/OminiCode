const fs = require('fs');

if (!fs.existsSync('server/models')) fs.mkdirSync('server/models', { recursive: true });
if (!fs.existsSync('server/engines')) fs.mkdirSync('server/engines', { recursive: true });
if (!fs.existsSync('server/orchestrator')) fs.mkdirSync('server/orchestrator', { recursive: true });

const findingTs = `
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type ConfidenceLevel = number; // 0-100
export type FindingStatus = 'Open' | 'Resolved' | 'Suppressed' | 'False Positive';

export interface Finding {
    id: string;
    title: string;
    severity: Severity;
    confidence: ConfidenceLevel;
    category: string;
    ruleId: string;
    cwe?: string;
    owasp?: string;
    language: string;
    file: string;
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
    description: string;
    technicalExplanation: string;
    evidence: string;
    dataFlow?: any[];
    remediation: string;
    suggestedPatch?: string;
    sourceEngine: string;
    relatedFindings?: string[];
    status: FindingStatus;
    fingerprint: string;
}
`;
fs.writeFileSync('server/models/Finding.ts', findingTs);

const scanJobTs = `
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
`;
fs.writeFileSync('server/models/ScanJob.ts', scanJobTs);

const languageAdapterTs = `
export interface LanguageAdapter {
    id: string;
    name: string;
    extensions: string[];
    parser: any; // AST parser interface
    staticAnalyzers: any[];
    formatter: any;
    dependencyResolver: any;
    frameworkDetectors: any[];
    securityRules: any[];
}
`;
fs.writeFileSync('server/engines/LanguageAdapter.ts', languageAdapterTs);

const orchestratorTs = `
import { ScanJob, ScanStatus } from '../models/ScanJob';

export class ScanOrchestrator {
    private activeJobs: Map<string, ScanJob> = new Map();

    async queueScan(repoId: string, branch: string, commitSha: string): Promise<ScanJob> {
        const jobId = 'job_' + Date.now();
        const job: ScanJob = {
            id: jobId,
            organizationId: 'org_default',
            repositoryId: repoId,
            branch,
            commitSha,
            status: 'QUEUED',
            scanType: 'STANDARD',
            languages: [],
            totalFiles: 0,
            processedFiles: 0,
            skippedFiles: 0,
            failedFiles: 0,
            findings: [],
            startedAt: new Date().toISOString()
        };
        
        this.activeJobs.set(jobId, job);
        
        // Asynchronously process the job
        this.processJob(jobId).catch(console.error);
        
        return job;
    }
    
    async getJobStatus(jobId: string): Promise<ScanJob | null> {
        return this.activeJobs.get(jobId) || null;
    }

    private async processJob(jobId: string) {
        const job = this.activeJobs.get(jobId);
        if (!job) return;
        
        // This is a placeholder for the actual scan pipeline
        job.status = 'INDEXING';
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        job.status = 'ANALYZING';
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        job.status = 'COMPLETED';
        job.completedAt = new Date().toISOString();
        this.activeJobs.set(jobId, job);
    }
}

export const scanOrchestrator = new ScanOrchestrator();
`;
fs.writeFileSync('server/orchestrator/ScanOrchestrator.ts', orchestratorTs);
