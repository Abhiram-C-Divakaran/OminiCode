/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Basic robust block parsing for rendering
  const lines = content.split('\n');
  const renderedBlocks: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockLines: string[] = [];
  let blockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code block boundaries
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        const codeString = codeBlockLines.join('\n');
        const uniqueId = `code-block-${blockIndex++}`;
        renderedBlocks.push(
          <div key={uniqueId} className="my-5 bg-[#141416]/90 border border-white/5 rounded-xl overflow-hidden font-mono text-xs shadow-lg">
            <div className="bg-[#0e0e11] px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {codeBlockLanguage || 'terminal'}
                </span>
              </div>
              <button
                onClick={() => handleCopy(codeString)}
                className="text-[10px] text-slate-500 hover:text-slate-200 flex items-center gap-1 transition-all cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/5"
              >
                {copiedText === codeString ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre leading-relaxed select-text select-all">
              <code>{codeString}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Open code block
        inCodeBlock = true;
        codeBlockLanguage = line.trim().substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    // H1 Heading
    if (trimmed.startsWith('# ')) {
      renderedBlocks.push(
        <h1 key={i} className="text-2xl font-black text-white mt-8 mb-4 tracking-tight border-b border-white/5 pb-2">
          {trimmed.substring(2)}
        </h1>
      );
      continue;
    }

    // H2 Heading
    if (trimmed.startsWith('## ')) {
      renderedBlocks.push(
        <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3 tracking-tight">
          {trimmed.substring(3)}
        </h2>
      );
      continue;
    }

    // H3 Heading
    if (trimmed.startsWith('### ')) {
      renderedBlocks.push(
        <h3 key={i} className="text-md font-bold text-slate-200 mt-6 mb-2 tracking-tight">
          {trimmed.substring(4)}
        </h3>
      );
      continue;
    }

    // Bullet Items (starts with '-' or '*')
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemContent = trimmed.substring(2);
      
      // Parse inline strong tags **word** or `code`
      const formatted = parseInlineFormatting(itemContent);

      renderedBlocks.push(
        <div key={i} className="flex items-start gap-2.5 my-2.5 ml-1 text-slate-300 leading-relaxed text-sm select-text">
          <span className="text-brand-cyan font-bold mt-1.5 flex-shrink-0 text-[10px]">●</span>
          <span className="flex-grow">{formatted}</span>
        </div>
      );
      continue;
    }

    // Numbered lists
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      const num = numberMatch[1];
      const itemContent = numberMatch[2];
      const formatted = parseInlineFormatting(itemContent);

      renderedBlocks.push(
        <div key={i} className="flex items-start gap-2.5 my-3 text-slate-200 leading-relaxed text-sm select-text">
          <span className="text-brand-cyan font-bold text-sm flex-shrink-0 mt-0.5">{num}.</span>
          <span className="flex-grow font-semibold text-slate-100">{formatted}</span>
        </div>
      );
      continue;
    }

    // Paragraph
    if (trimmed !== '') {
      const formatted = parseInlineFormatting(trimmed);
      renderedBlocks.push(
        <p key={i} className="my-3 text-slate-300 leading-relaxed text-sm select-text">
          {formatted}
        </p>
      );
    } else {
      renderedBlocks.push(<div key={i} className="h-3" />);
    }
  }

  // Handle unclosed code blocks gracefully
  if (inCodeBlock && codeBlockLines.length > 0) {
    const codeString = codeBlockLines.join('\n');
    renderedBlocks.push(
      <pre key="unclosed" className="p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-xs overflow-x-auto my-3 text-slate-300 select-text">
        <code>{codeString}</code>
      </pre>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-1 select-text">
      {renderedBlocks}
    </div>
  );
}

// Simple and robust inline markdown parser (**bold** and `code`)
function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let index = 0;

  // Pattern matches: **bold** OR `code` OR simple text
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const matches = text.match(regex);

  if (!matches) {
    return [text];
  }

  let lastIndex = 0;
  let match;

  // We loop to reconstruct the segments
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchStr = match[0];

    // Text before match
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
      // Bold
      parts.push(
        <strong key={matchIndex} className="text-white font-extrabold font-sans">
          {matchStr.slice(2, -2)}
        </strong>
      );
    } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
      // Inline Code
      parts.push(
        <code key={matchIndex} className="px-1.5 py-0.5 bg-[#1a1a20] border border-white/5 text-brand-cyan rounded text-xs font-mono font-bold mx-0.5 select-all">
          {matchStr.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
