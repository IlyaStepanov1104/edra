import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from '@/chat/bot.entity';
import { Message, MessageSchema } from '@/chat/message.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bot.name, schema: BotSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
