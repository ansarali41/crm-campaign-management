import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CAMPAIGN_SERVICE_NAME } from 'src/util/constants';
import { CampaignStatus } from 'src/util/enums';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { WebSocketGateway } from './websocket.gateway';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @Inject(CAMPAIGN_SERVICE_NAME) private campaignClient: ClientProxy,
    private wsGateway: WebSocketGateway,
  ) {}

  async create(createCampaignDto: any, userId: string) {
    try {
      const campaign = new this.campaignModel({
        ...createCampaignDto,
        createdBy: userId,
      });
      const savedCampaign = await campaign.save();

      if (savedCampaign.scheduledAt) {
        this.scheduleCampaign(savedCampaign);
      }

      this.wsGateway.notifyNewCampaign(savedCampaign);
      return savedCampaign;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: any = {}) {
    try {
      return this.campaignModel
        .find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const campaign = await this.campaignModel
        .findById(id)
        .populate('createdBy', 'name email');

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      return campaign;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCampaignDto: any) {
    try {
      const campaign = await this.campaignModel
        .findByIdAndUpdate(id, updateCampaignDto, { new: true })
        .populate('createdBy', 'name email');

      if (campaign.scheduledAt) {
        this.scheduleCampaign(campaign);
      }

      return campaign;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return this.campaignModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  private scheduleCampaign(campaign: CampaignDocument) {
    this.campaignClient.emit('campaign.schedule', {
      id: campaign._id,
      type: campaign.type,
      recipients: campaign.recipients,
      content: campaign.content,
      scheduledAt: campaign.scheduledAt,
    });
  }

  async updateCampaignStatus(
    id: string,
    status: CampaignStatus,
    metrics?: any,
  ) {
    try {
      const campaign = await this.campaignModel.findByIdAndUpdate(
        id,
        { status, ...metrics },
        { new: true },
      );

      this.wsGateway.notifyCampaignUpdate(campaign);
      return campaign;
    } catch (error) {
      throw error;
    }
  }
}
