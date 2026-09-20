export type ScanMode = "quick" | "standard" | "deep" | "security" | "quality" | "performance" | "full";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface Finding {
    id: string;
    severity: Severity;
    confidence: number;
    title: string;
    file: string;
    line: number;
    column?: number;
    cwe?: string;
    owasp?: string;
    category: string;
    description: string;
    recommendation: string;
    sourceEngine: string;
    fixId?: string;
    status?: 'Open' | 'Fixed' | 'Suppressed' | 'Accepted Risk' | 'False Positive';
}
