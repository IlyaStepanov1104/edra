import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export type UserMessage = {
  role: 'user';
  content: string;
};

export type AssistantMessage = {
  role: 'assistant';
  content: string;
};

export type SystemMessage = {
  role: 'system';
  content: string;
};

export type OpenAIChatMessage = UserMessage | AssistantMessage | SystemMessage;

interface BotConfig {
  model: string;
  temperature: number;
  systemMessage: string;
}

export const BOTS_CONFIG: Record<string, BotConfig> = {
  'information': {
    model: 'gpt-4',
    temperature: 0.7,
    systemMessage: 'You are a helpful assistant that provides general information'
  },
  'reading-writing-1': {
    model: 'gpt-4',
    temperature: 0.7,
    systemMessage: 'You are an expert in reading comprehension and writing'
  },
  'math-1': {
    model: 'gpt-4',
    temperature: 0.3,
    systemMessage: 'You are a math tutor specializing in algebra'
  }
};

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('OpenAI API key is not configured properly');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async getBotResponse(botId: string, messages: OpenAIChatMessage[]) {
    const botConfig = BOTS_CONFIG[botId] || BOTS_CONFIG['information'];
    const response = await this.openai.chat.completions.create({
      model: botConfig.model,
      messages,
      temperature: botConfig.temperature
    });
    return response.choices[0].message.content;
  }
}