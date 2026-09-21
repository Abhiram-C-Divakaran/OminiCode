// Cross-platform equivalent of NODE_ENV=production node dist/server.cjs.
process.env.NODE_ENV = 'production';
await import('../../dist/server.cjs');
