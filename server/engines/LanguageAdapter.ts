
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
