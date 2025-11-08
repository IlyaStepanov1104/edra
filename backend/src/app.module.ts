import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from '@/api.module';
import {ConfigModule} from "@nestjs/config"; // пример схемы

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../.env',
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/edra?retryWrites=true&w=majority', {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000
        }),

        RouterModule.register([
            { path: 'api', module: ApiModule },
            { path: 'admin', module: AdminModule },
        ]),

        ApiModule,
        AdminModule,
    ],
})
export class AppModule {}
