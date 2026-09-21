// Placeholder capability slots; concrete deterministic engine interfaces belong to Phase 6.

export interface LanguageAdapter {
    id: string;
    name: string;
    extensions: string[];
    parser: unknown; // AST parser interface
    staticAnalyzers: unknown[];
    formatter: unknown;
    dependencyResolver: unknown;
    frameworkDetectors: unknown[];
    securityRules: unknown[];
}
