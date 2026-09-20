/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VirtualFile {
  path: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  diffExplanation?: string;
  diffPath?: string;
  diffContent?: string; // Proposed code change or file content
}

export interface ReviewIssue {
  line: number;
  comment: string;
  suggestion: string;
  category: 'Security' | 'Bug' | 'Performance' | 'Style' | 'Other';
  confidence: number; // 0 to 100
}

export interface ReviewResult {
  filePath: string;
  score: number;
  praises: string[];
  errors: ReviewIssue[];
  suggestions: ReviewIssue[];
  fixed_code: string;
  timestamp: number;
  cyclomaticComplexity?: number;
  cognitiveComplexity?: number;
  reviewDuration?: number;
  technicalDebt?: number;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  icon: string;
  author: string;
  type: 'theme' | 'tool' | 'utility' | 'linter';
  config?: Record<string, any>;
}

export interface ProjectState {
  files: VirtualFile[];
  activeFilePath: string | null;
  chatMessages: ChatMessage[];
  installedExtensions: string[]; // IDs
  reviews: Record<string, ReviewResult>; // filePath -> ReviewResult
}
