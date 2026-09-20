
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
