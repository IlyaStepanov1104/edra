import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/jwt-payload.interface';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post(':botId/send')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Req() req: Request & { user: JwtPayload },
    @Param('botId') botId: string,
    @Body('message') message: string
  ) {
    return this.chatService.sendMessage(req.user.userId, botId, message);
  }

  @Get(':botId/history')
  @UseGuards(JwtAuthGuard)
  async getHistory(
    @Req() req: Request & { user: JwtPayload },
    @Param('botId') botId: string
  ) {
    return this.chatService.getChatHistory(req.user.userId, botId);
  }
}