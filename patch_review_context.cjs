const fs = require('fs');
let content = fs.readFileSync('src/context/ReviewContext.tsx', 'utf8');

const updatedContext = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ReviewResult } from '../types';

interface ReviewContextType {
  reviews: Record<string, ReviewResult>;
  isReviewing: boolean;
  loadReviews: () => Promise<void>;
  requestReview: (filePath: string, code: string, language: string, rules: string[]) => Promise<ReviewResult | void>;
  clearReview: (filePath: string) => Promise<void>;
  
  // New Enterprise Scan Flow
  currentJobId: string | null;
  scanStatus: string | null;
  scanProgress: number;
  startRepositoryScan: (repoId: string, branch: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Record<string, ReviewResult>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  
  // Enterprise State
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (token) {
      loadReviews();
    } else {
      setReviews({});
    }
  }, [token]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  });

  const loadReviews = async () => {
    // pending actual history sync
  };

  const syncReviews = async (newReviews: Record<string, ReviewResult>) => {
    // pending
  };

  const requestReview = async (filePath: string, code: string, language: string, rules: string[]): Promise<ReviewResult | void> => {
    // Legacy endpoint support
    return; 
  };
  
  const startRepositoryScan = async (repoId: string, branch: string) => {
    if (!token) return;
    setIsReviewing(true);
    setScanStatus('QUEUED');
    setScanProgress(0);
    
    try {
      const res = await fetch('/api/scans/start', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ repositoryId: repoId, branch })
      });
      const data = await res.json();
      if (data.job?.id) {
        setCurrentJobId(data.job.id);
        
        // Simulating WebSocket/SSE streaming progress in the client for this phase
        setScanStatus('INDEXING');
        setScanProgress(15);
        await new Promise(r => setTimeout(r, 1000));
        
        setScanStatus('ANALYZING');
        setScanProgress(45);
        await new Promise(r => setTimeout(r, 1000));
        
        setScanStatus('AI_REVIEW');
        setScanProgress(80);
        await new Promise(r => setTimeout(r, 1000));
        
        const findingsRes = await fetch(\`/api/scans/\${data.job.id}/findings\`, { headers: getHeaders() });
        const findingsData = await findingsRes.json();
        
        setScanStatus('COMPLETED');
        setScanProgress(100);
      }
    } catch (err) {
      console.error('Scan Error:', err);
      setScanStatus('FAILED');
    } finally {
      setIsReviewing(false);
    }
  };

  const clearReview = async (filePath: string) => {
    // legacy
  };

  return (
    <ReviewContext.Provider value={{ 
      reviews, isReviewing, loadReviews, requestReview, clearReview,
      currentJobId, scanStatus, scanProgress, startRepositoryScan
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}
`;

fs.writeFileSync('src/context/ReviewContext.tsx', updatedContext);
