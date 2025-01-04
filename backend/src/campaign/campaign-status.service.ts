import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CampaignStatus } from '../util/enums';
import { WebSocketGateway } from './websocket.gateway';

@Injectable()
export class CampaignStatusService {
  private readonly logger = new Logger(CampaignStatusService.name);

  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private wsGateway: WebSocketGateway,
  ) {}

  async updateStatus(
    campaignId: string,
    status: CampaignStatus,
  ): Promise<Campaign> {
    try {
      const campaign = await this.campaignModel
        .findByIdAndUpdate({ _id: campaignId }, { status }, { new: true })
        .exec();

      return campaign;
    } catch (error) {
      this.logger.error(`Failed to update campaign status: ${error?.message}`);
      throw error;
    }
  }
}
