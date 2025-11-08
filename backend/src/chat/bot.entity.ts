import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bot extends Document {
  @Prop({ type: String, required: true, _id: true })
  declare _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  module: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BotSchema = SchemaFactory.createForClass(Bot);