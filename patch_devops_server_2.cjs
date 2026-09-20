const fs = require('fs');
let serverCode = fs.readFileSync('server.ts', 'utf8');

const triggerRoute = `
// --- DEVOPS ROUTES ---
app.post('/api/devops/pipelines/trigger', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { repositoryId, branch, environment } = req.body;
  if (!repositoryId || !branch || !environment) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const runId = 'CI-' + Math.floor(1000 + Math.random() * 9000);
  
  // Here we use the actual Firebase admin SDK to write to Firestore since it's real-time.
  // We need to require it dynamically or if already initialized.
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
       admin.initializeApp();
    }
    const adminDb = admin.firestore();
    
    await adminDb.collection('organizations').doc('default').collection('pipeline_runs').doc(runId).set({
        provider: 'GitHub Actions',
        repositoryId,
        branch,
        commitSha: Math.random().toString(16).substring(2, 9),
        commitMessage: 'Triggered from WyrmSentry (Manual)',
        status: 'RUNNING',
        startedAt: Date.now(),
        completedAt: 0,
        duration: '',
        environment
    });
    
    // Simulate pipeline completion after 10 seconds
    setTimeout(async () => {
      try {
        await adminDb.collection('organizations').doc('default').collection('pipeline_runs').doc(runId).update({
          status: 'SUCCESS',
          completedAt: Date.now(),
          duration: '10s'
        });
        
        // Log event
        await adminDb.collection('organizations').doc('default').collection('logs').add({
          environmentId: environment,
          timestamp: Date.now(),
          message: 'Pipeline ' + runId + ' completed successfully.',
          severity: 'INFO',
          source: 'github-actions'
        });
      } catch (e) {
        console.error("Async completion error:", e);
      }
    }, 10000);
    
  } catch (err) {
    console.error("Firebase admin err:", err);
    return res.status(500).json({ error: 'Internal error talking to provider DB' });
  }

  res.json({ success: true, message: 'Pipeline trigger submitted', runId });
});
`;

serverCode = serverCode.replace(/\/\/ --- DEVOPS ROUTES ---\napp\.post\('\/api\/devops\/pipelines\/trigger', requireAuth, async \(req: AuthenticatedRequest, res\) => \{[\s\S]*?res\.json\(\{ success: true, message: 'Pipeline trigger submitted' \}\);\n\}\);/, triggerRoute.trim());
fs.writeFileSync('server.ts', serverCode);
console.log('Patched server.ts with BETTER devops routes');
