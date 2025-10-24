import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Statistics extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  botId: string;

  @Prop({ type: Object, required: true })
  metrics: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);