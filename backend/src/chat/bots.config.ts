interface BotConfig {
  model: string;
  temperature: number;
  systemMessage: string;
}

export const BOTS_CONFIG: Record<string, BotConfig> = {
  // 1 общий бот для information
  'information': {
    model: 'gpt-4',
    temperature: 0.7,
    systemMessage: 'You are a helpful assistant that provides general information'
  },
  // 7 ботов для reading-and-writing
  'reading-writing-1': {
    model: 'gpt-4',
    temperature: 0.7,
    systemMessage: 'You are an expert in reading comprehension and writing'
  },
  // ... остальные 6 ботов
  // 17 ботов для math
  'math-1': {
    model: 'gpt-4',
    temperature: 0.3,
    systemMessage: 'You are a math tutor specializing in algebra'
  },
  // ... остальные 16 ботов
};