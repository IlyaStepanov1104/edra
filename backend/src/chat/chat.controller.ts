import {
    Controller,
    Post,
    Body,
    Req,
    Get,
    Param,
} from '@nestjs/common';
import {ChatService} from './chat.service';
import {Request} from 'express';

@Controller('api/chat')
export class ChatController {
    constructor(private chatService: ChatService) {
    }

    @Post(':botId/send')
    async sendMessage(
        @Req() req: Request & { clientToken: string },
        @Param('botId') botId: string,
        @Body('message') message: string
    ) {
        const clientToken = req.clientToken;
        return this.chatService.sendMessage(clientToken, botId, message);
    }

    @Get(':botId/history')
    async getHistory(
        @Req() req: Request & { clientToken: string },
        @Param('botId') botId: string
    ) {
        const clientToken = req.clientToken;
        return this.chatService.getChatHistory(clientToken, botId);
    }
}