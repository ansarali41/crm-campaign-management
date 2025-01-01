import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CAMPAIGN_SERVICE_NAME } from 'src/util/constants';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { WebSocketGateway } from './websocket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: CAMPAIGN_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('rabbitmq.queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, WebSocketGateway],
})
export class CampaignModule {}
