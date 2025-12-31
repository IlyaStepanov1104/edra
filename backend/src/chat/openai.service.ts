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
}

export const BOTS_CONFIG: BotConfig = {
    model: 'gpt-5.2',
    temperature: 0.7,
};

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('OpenAI API key is not configured properly. Please set OPENAI_API_KEY in your environment variables and ensure it starts with sk-.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async getBotResponse(messages: OpenAIChatMessage[]) {
    const botConfig = BOTS_CONFIG;
    const response = await this.openai.chat.completions.create({
      model: botConfig.model,
      messages,
      temperature: botConfig.temperature
    });
    return response.choices[0].message.content;
  }
}