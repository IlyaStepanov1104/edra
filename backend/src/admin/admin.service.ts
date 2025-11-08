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
    getMessages(botId: string) {
        return this.messageModel.find({ botId }).sort({ createdAt: -1 }).exec();
    }
}
