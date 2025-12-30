import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatSession extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    botId: string;

    @Prop({ required: true })
    sessionStartedAt: Date;

    @Prop({ required: true })
    lastMessageAt: Date;

    @Prop({ default: false })
    summaryGenerated: boolean;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
