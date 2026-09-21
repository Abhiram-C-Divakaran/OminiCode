const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
const config = require('../../firebase-applet-config.json');

if (process.env.OMINICODE_SEED_PROJECT !== config.projectId) {
  throw new Error('Set OMINICODE_SEED_PROJECT to the target Firebase project ID to explicitly allow fixture writes. Review scripts/README.md first.');
}
module.exports = config;
