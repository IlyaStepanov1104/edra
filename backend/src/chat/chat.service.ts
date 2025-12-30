import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Message} from './message.entity';
import {Bot} from './bot.entity';
import {OpenaiService, OpenAIChatMessage} from './openai.service';
import {ChatSession} from "@/chat/chat-session.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        @InjectModel(Bot.name) private botModel: Model<Bot>,
        @InjectModel(ChatSession.name) private sessionModel: Model<ChatSession>,
        private openaiService: OpenaiService,
    ) {
    }

    async sendMessage(userId: string, botId: string, message: string) {
        const now = new Date();
        let session = await this.sessionModel.findOne({userId, botId, summaryGenerated: false});
        if (!session) {
            session = await this.sessionModel.findOneAndUpdate(
                {userId, botId},
                {
                    sessionStartedAt: now,
                    lastMessageAt: now,
                    summaryGenerated: false,
                },
                {upsert: true, new: true}
            );
        }

        const userMessage = await this.messageModel.create({
            userId,
            botId,
            role: 'user',
            content: message,
        });

        session.lastMessageAt = userMessage.createdAt;
        await session.save();

        const bot = await this.botModel.findById(botId).exec();
        if (!bot) throw new Error('Bot not found');

        const history = await this.messageModel
            .find({userId, botId})
            .sort({createdAt: -1})
            .limit(5)
            .exec();

        const messages: OpenAIChatMessage[] = [
            {role: 'system', content: bot.prompt},
            ...history.reverse().map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            }))
        ];

        let response: string;
        try {
            response = await this.openaiService.getBotResponse(botId, messages);
        } catch (error) {
            response = 'Sorry, there was a mistake. Please try again later.';
            console.error('Error when generating the bot\'s response:', error);
        }

        const botMessage = await this.messageModel.create({
            userId,
            botId,
            role: 'assistant',
            content: response
        });

        session.lastMessageAt = botMessage.createdAt;
        await session.save();

        return response;
    }

    async getChatHistory(userId: string, botId: string) {
        return this.messageModel
            .find({userId, botId})
            .sort({createdAt: 1})
            .exec();
    }
}