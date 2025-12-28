import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {ChatModule} from './chat/chat.module';
import {StatisticsModule} from './statistics/statistics.module';
import { QrModule } from './qr/qr.module';
import {ClientTokenGuard} from "./auth/client-token.guard";

@Module({
    imports: [ChatModule, StatisticsModule, QrModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ClientTokenGuard, // Защита всего API
        },
    ],
})
export class ApiModule {
}
