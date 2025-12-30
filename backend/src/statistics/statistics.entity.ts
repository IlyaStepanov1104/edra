import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface BotStatistics {
    understandingPercent: number; // 0–100
    comment: string;              // короткий текст
}

@Schema()
export class Statistics extends Document {
    @Prop({ required: true, unique: true })
    userId: string;

    @Prop({
        type: Object,
        default: {},
    })
    metrics: Record<string, BotStatistics>;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
