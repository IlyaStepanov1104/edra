import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Statistics } from './statistics.entity';
import { OpenaiService } from '../chat/openai.service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Statistics.name) private statsModel: Model<Statistics>,
    private openaiService: OpenaiService,
  ) {}

  async getStatistics(userId: string, botId: string) {
    return this.statsModel.findOne({ userId, botId }).exec();
  }

  async updateStatistics(userId: string, botId: string, chatHistory: string[]) {
    const messages = [{
      role: 'user' as const,
      content: chatHistory.join('\n')
    }];
    
    const summary = await this.openaiService.getBotResponse(botId, messages);

    const stats = await this.statsModel.findOneAndUpdate(
      { userId, botId },
      { 
        metrics: JSON.parse(summary),
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return stats;
  }
}