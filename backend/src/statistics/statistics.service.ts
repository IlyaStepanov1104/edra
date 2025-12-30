import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Statistics} from './statistics.entity';
import {OpenaiService, OpenAIChatMessage} from '@/chat/openai.service';
import {Message} from '@/chat/message.entity';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectModel(Statistics.name) private statsModel: Model<Statistics>,
    ) {
    }

    async getStatistics(userId: string, botId?: string) {
        const stats = await this.statsModel.findOne({userId}).exec();
        if (!stats) return {};

        if (botId) {
            return stats.metrics[botId] || null;
        }

        return stats.metrics;
    }

}
