import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bot } from '@/chat/bot.entity';
import { Message } from '@/chat/message.entity';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Bot.name) private botModel: Model<Bot>,
        @InjectModel(Message.name) private messageModel: Model<Message>,
    ) {}

    // CRUD BOT
    getBots() {
        return this.botModel.find().sort({ createdAt: -1 }).exec();
    }

    getBot(id: string) {
        return this.botModel.findById(id).exec();
    }

    createBot(data) {
        return this.botModel.create(data);
    }

    updateBot(id: string, data) {
        return this.botModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    deleteBot(id: string) {
        return this.botModel.findByIdAndDelete(id).exec();
    }

    // Messages
    async getMessages(filters?: {
        user?: string;
        bot?: string;
        from?: Date;
        to?: Date;
    }) {
        const query: any = {};

        if (filters?.user) query.userId = filters.user;
        if (filters?.bot) query.botId = filters.bot;
        if (filters?.from || filters?.to) {
            query.createdAt = {};
            if (filters.from) query.createdAt.$gte = filters.from;
            if (filters.to) query.createdAt.$lte = filters.to;
        }

        // Получаем сообщения по базовым фильтрам
        let messages = await this.messageModel.find(query).sort({ createdAt: -1 }).lean();

        // Получаем все боты, чтобы подтянуть имя и модуль
        const botIds = Array.from(new Set(messages.map(m => m.botId.toString())));
        const bots = await this.botModel.find({ _id: { $in: botIds } }).lean();
        const botMap = Object.fromEntries(bots.map(b => [b._id.toString(), b]));

        messages = messages.map(m => ({
            ...m,
            botName: botMap[m.botId.toString()]?.name ?? '',
            botModule: botMap[m.botId.toString()]?.module ?? '',
        }));

        return messages;
    }
}
