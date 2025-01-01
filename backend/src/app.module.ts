import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import configuration from './config/configuration';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Feature modules
    AuthModule,
    CampaignModule,
    WorkerModule,
  ],
})
export class AppModule {}
