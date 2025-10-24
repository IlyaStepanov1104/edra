import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.entity';
import { Bot } from './bot.entity';
import { OpenaiService, OpenAIChatMessage } from './openai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Bot.name) private botModel: Model<Bot>,
    private openaiService: OpenaiService,
  ) {}

  async sendMessage(userId: string, botId: string, message: string) {
    await this.messageModel.create({
      userId,
      botId,
      role: 'user',
      content: message
    });

    const bot = await this.botModel.findById(botId).exec();
    if (!bot) throw new Error('Bot not found');

    const history = await this.messageModel
      .find({ userId, botId })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    const messages: OpenAIChatMessage[] = [
      { role: 'system', content: bot.prompt },
      ...history.reverse().map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    let response: string;
    try {
      response = await this.openaiService.getBotResponse(botId, messages);
    } catch (error) {
      response = 'Извините, произошла ошибка. Пожалуйста, попробуйте позже.';
      console.error('Ошибка при генерации ответа бота:', error);
    }

    await this.messageModel.create({
      userId,
      botId,
      role: 'assistant',
      content: response
    });

    return response;
  }

  async getChatHistory(userId: string, botId: string) {
    return this.messageModel
      .find({ userId, botId })
      .sort({ createdAt: 1 })
      .exec();
  }
}