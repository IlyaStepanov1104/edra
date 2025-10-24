import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { Bot } from './bot.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller('bots')
export class BotController {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<Bot>,
  ) {}

  @Post()
  async create(@Body() createBotDto: { name: string; description: string; prompt: string }) {
    const createdBot = new this.botModel(createBotDto);
    return createdBot.save();
  }

  @Get()
  async findAll() {
    return this.botModel.find().exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.botModel.findById(id).exec();
  }

  @Put(':id/prompt')
  async updatePrompt(
    @Param('id') id: string,
    @Body() updatePromptDto: { prompt: string }
  ) {
    return this.botModel.findByIdAndUpdate(
      id,
      { prompt: updatePromptDto.prompt },
      { new: true }
    ).exec();
  }
}