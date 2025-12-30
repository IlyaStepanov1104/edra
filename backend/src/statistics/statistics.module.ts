import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Statistics, StatisticsSchema} from './statistics.entity';
import {StatisticsService} from './statistics.service';
import {StatisticsController} from './statistics.controller';
import {ChatModule} from '@/chat/chat.module';
import {StatisticsAggregatorService} from "@/statistics/statistics-aggregator.service";
import {StatisticsCron} from "@/statistics/statistics.cron";
import {ChatSession, ChatSessionSchema} from "@/chat/chat-session.entity";
import {Message, MessageSchema} from "@/chat/message.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Statistics.name, schema: StatisticsSchema},
            {name: ChatSession.name, schema: ChatSessionSchema},
            {name: Message.name, schema: MessageSchema},]),
        ChatModule,
    ],
    controllers: [StatisticsController],
    providers: [StatisticsAggregatorService, StatisticsCron, StatisticsService],
    exports: [StatisticsService],
})
export class StatisticsModule {
}