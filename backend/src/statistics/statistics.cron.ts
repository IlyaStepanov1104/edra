import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ChatSession} from '@/chat/chat-session.entity';
import {Message} from '@/chat/message.entity';
import {OpenaiService} from '@/chat/openai.service';
import {StatisticsAggregatorService} from './statistics-aggregator.service';

@Injectable()
export class StatisticsCron {
    constructor(
        @InjectModel(ChatSession.name)
        private sessionModel: Model<ChatSession>,
        @InjectModel(Message.name)
        private messageModel: Model<Message>,
        private openaiService: OpenaiService,
        private aggregator: StatisticsAggregatorService,
    ) {
    }

    @Cron('*/1 * * * *')
    async handleInactiveSessions() {
        const threshold = new Date(Date.now() - 5 * 60 * 1000);

        const sessions = await this.sessionModel.find({
            lastMessageAt: {$lt: threshold},
            summaryGenerated: false,
        });

        for (const session of sessions) {
            const messages = await this.messageModel
                .find({
                    userId: session.userId,
                    botId: session.botId,
                    createdAt: {
                        $gte: session.sessionStartedAt,
                        $lte: session.lastMessageAt,
                    },
                })
                .sort({createdAt: 1});

            if (!messages.length) {
                session.summaryGenerated = true;
                await session.save();
                continue;
            }

            const summary = await this.openaiService.getBotResponse(
                [
                    {
                        role: 'system',
                        content: `
Summarize how well the user understands the topic.
Focus on mistakes, confidence, and progress.
1–2 paragraphs max.
          `,
                    },
                    {
                        role: 'user',
                        content: messages.map(m => m.content).join('\n'),
                    },
                ],
            );

            await this.aggregator.updateUserStatistics(
                session.userId,
                session.botId,
                summary,
            );

            session.summaryGenerated = true;
            await session.save();
        }
    }
}
