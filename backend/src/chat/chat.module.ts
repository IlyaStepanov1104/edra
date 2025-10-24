import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiService } from './openai.service';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { BotController } from './bot.controller';
import { Message, MessageSchema } from './message.entity';
import { Bot, BotSchema } from './bot.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Bot.name, schema: BotSchema }
    ]),
  ],
  controllers: [ChatController, BotController],
  providers: [ChatService, OpenaiService],
  exports: [ChatService, OpenaiService],
})
export class ChatModule {}