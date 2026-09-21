import 'dotenv/config';
import { PRODUCT } from '../../src/config/product';

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}
export const serverConfig = {
  port,
  appUrl: process.env.APP_URL || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || PRODUCT.defaultAiModel,
  firestoreDatabaseId: process.env.FIRESTORE_DATABASE_ID || '(default)',
};
