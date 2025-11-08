import {Controller, Get, Post, Body, Param, Put, Query} from '@nestjs/common';
import { Bot } from './bot.entity';
import {Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller('api/bots')
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
  async findAll(@Query('module') module?: string) {
    const filter = module ? { module } : {};
    return this.botModel.find(filter).exec();
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