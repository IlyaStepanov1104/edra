import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/types/jwt-payload.interface';
import { Request } from 'express';

@Controller('api/statistics')
export class StatisticsController {
  constructor(private statsService: StatisticsService) {}

  @Get(':botId')
  @UseGuards(JwtAuthGuard)
  async getStats(
    @Req() req: Request & { user: JwtPayload },
    @Param('botId') botId: string
  ) {
    return this.statsService.getStatistics(req.user.userId, botId);
  }
}