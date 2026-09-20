const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `});

// ==========================================
// 6. DEDICATED USER MANAGEMENT & METRICS API
// ==========================================

// Get user profile including extended data (preferences, permissions)
app.get('/api/users/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user!.id).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const data = userDoc.data() || {};
    // Ensure defaults
    if (!data.preferences) data.preferences = { theme: 'dark', editorFontSize: 14 };
    if (!data.permissions) data.permissions = { canCreateFiles: true, canRunAI: true, role: 'user' };
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Preferences
app.post('/api/users/me/preferences', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const preferences = req.body;
    await db.collection('users').doc(req.user!.id).set({
      preferences,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    res.json({ success: true, preferences });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Permissions (Admin restricted in a full implementation)
app.post('/api/users/me/permissions', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const permissions = req.body;
    await db.collection('users').doc(req.user!.id).set({
      permissions,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    res.json({ success: true, permissions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Comprehensive User Activity Log (Different from Analytics)
app.post('/api/users/me/activity-log', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { action, details } = req.body;
    const activityRef = db.collection('users').doc(req.user!.id).collection('activity_logs').doc();
    await activityRef.set({
      action,
      details: details || {},
      timestamp: new Date().toISOString(),
      ip: req.ip || req.socket?.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Comprehensive User Activity Log
app.get('/api/users/me/activity-log', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const limitCount = parseInt(req.query.limit as string) || 50;
    const snapshot = await db.collection('users').doc(req.user!.id)
      .collection('activity_logs')
      .orderBy('timestamp', 'desc')
      .limit(limitCount)
      .get();
      
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. DEV/PRODUCTION STATIC HOSTING WITH VITE
// ==========================================`;

code = code.replace(/}\);\n\n\n\/\/ ==========================================\n\/\/ 6\. DEV\/PRODUCTION STATIC HOSTING WITH VITE\n\/\/ ==========================================/s, replacement);

fs.writeFileSync('server.ts', code);
