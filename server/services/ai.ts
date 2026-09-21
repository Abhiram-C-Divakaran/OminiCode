import Groq from 'groq-sdk';
import { serverConfig } from '../config';

let client: Groq | undefined;
/** Keep non-AI local pages usable without an API key. */
export function getGroqClient(): Groq {
  if (!serverConfig.groqApiKey) throw new Error('Set GROQ_API_KEY in .env to enable AI assistance.');
  return client ??= new Groq({ apiKey: serverConfig.groqApiKey });
}
