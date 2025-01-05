import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'src/config/configuration';
import { EmailConsumerModule } from 'src/email-consumer/email-consumer.module';
import { CampaignStatusService } from './campaign-status.service';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { WebSocketGateway } from './websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),

    // MongoDB Schema
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),

    forwardRef(() => EmailConsumerModule),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, WebSocketGateway, CampaignStatusService],
  exports: [CampaignService, WebSocketGateway, CampaignStatusService],
})
export class CampaignModule {}
