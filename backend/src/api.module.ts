import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {JwtAuthGuard} from './auth/jwt-auth.guard';
import {AuthModule} from './auth/auth.module';
import {ChatModule} from './chat/chat.module';
import {StatisticsModule} from './statistics/statistics.module';
import { QrModule } from './qr/qr.module';

@Module({
    imports: [AuthModule, ChatModule, StatisticsModule, QrModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard, // Защита всего API
        },
    ],
})
export class ApiModule {
}
