import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from '../campaign/schemas/campaign.schema';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
  ],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
