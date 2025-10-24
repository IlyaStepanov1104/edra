import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bot extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BotSchema = SchemaFactory.createForClass(Bot);