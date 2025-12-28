import { Controller, Get, Req, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Request } from 'express';

@Controller('api/statistics')
export class StatisticsController {
  constructor(private statsService: StatisticsService) {}

  @Get(':botId')
  async getStats(
    @Req() req: Request & { clientToken: string },
    @Param('botId') botId: string
  ) {
    return this.statsService.getStatistics(req.clientToken, botId);
  }
}