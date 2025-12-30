import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Statistics, BotStatistics } from './statistics.entity';
import { OpenaiService } from '@/chat/openai.service';

@Injectable()
export class StatisticsAggregatorService {
    constructor(
        @InjectModel(Statistics.name)
        private statsModel: Model<Statistics>,
        private openaiService: OpenaiService,
    ) {}

    async updateUserStatistics(
        userId: string,
        botId: string,
        sessionSummary: string,
    ) {
        const stats =
            (await this.statsModel.findOne({ userId })) ??
            (await this.statsModel.create({ userId }));

        const messages = [
            {
                role: 'system' as const,
                content: `
You analyze how well the user understands a subject.
For EACH bot return ONLY this JSON format:

{
  "<botId>": {
    "understandingPercent": number (0-100),
    "comment": string
  }
}

Rules:
- understandingPercent must be realistic
- comment must be short (3-4 sentences)
- JSON ONLY, no markdown
        `,
            },
            {
                role: 'user' as const,
                content: JSON.stringify({
                    botId,
                    previousStatistics: stats.metrics[botId] ?? null,
                    sessionSummary,
                }),
            },
        ];

        let parsed: Record<string, BotStatistics>;

        try {
            const response = await this.openaiService.getBotResponse(
                'statistics',
                messages,
            );
            parsed = JSON.parse(response);
        } catch {
            throw new BadRequestException('Invalid statistics JSON from OpenAI');
        }

        stats.metrics = {
            ...stats.metrics,
            ...parsed,
        };

        stats.updatedAt = new Date();
        await stats.save();

        return stats;
    }
}
