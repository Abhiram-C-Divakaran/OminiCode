/** Shared, non-secret product identity. */
export const PRODUCT = {
  name: 'OminiCode',
  tagline: 'Build. Secure. Ship.',
  repositoryUrl: 'https://github.com/Abhiram-C-Divakaran/OminiCode',
  defaultRepository: { id: 'ominicode-core', name: 'OminiCode-Core' },
  defaultAiModel: 'openai/gpt-oss-120b',
  defaultAiModelLabel: 'GPT-OSS 120B',
} as const;
