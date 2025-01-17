import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailConsumerService } from 'src/email-consumer/email-consumer.service';
import { CampaignStatus, CampaignType } from 'src/util/enums';
import { AnalyticsOverview } from 'src/util/interfaces';
import { CampaignStatusService } from './campaign-status.service';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { WebSocketGateway } from './websocket.gateway';

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,

    private wsGateway: WebSocketGateway,
    private emailConsumerService: EmailConsumerService,
    private campaignStatusService: CampaignStatusService,
  ) {}

  async create(createCampaignDto: any, userId: string) {
    try {
      const campaign = new this.campaignModel({
        ...createCampaignDto,
        createdBy: userId,
      });
      const savedCampaign = await campaign.save();

      // if (savedCampaign.scheduledAt) {
      //   this.scheduleCampaign(savedCampaign);
      // }

      // this.wsGateway.notifyNewCampaign(savedCampaign);
      return savedCampaign;
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryDto: QueryCampaignDto) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        ...filters
      } = queryDto;

      const query: any = {};

      // Add filters if they exist
      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.createdBy) {
        query.createdBy = filters.createdBy;
      }

      const skip = (page - 1) * limit;
      const sortOptions = { [sortBy]: sortOrder };

      const [campaigns, total] = await Promise.all([
        this.campaignModel
          .find(query)
          .populate('createdBy', 'name email')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit),
        this.campaignModel.countDocuments(query),
      ]);

      return {
        campaigns,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
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
      return await this.campaignModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  private scheduleCampaign(campaign: CampaignDocument) {
    console.log('scheduleCampaign::', campaign);
    // this.emailClient.emit('campaign.schedule', {
    //   id: campaign._id,
    //   type: campaign.type,
    //   recipients: campaign.recipients,
    //   content: campaign.content,
    //   scheduledAt: campaign.scheduledAt,
    // });
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

  async sendCampaignEmails(campaignId: string) {
    try {
      const campaign = await this.findOne(campaignId);
      if (!campaign) {
        throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
      }

      // Send emails to each recipient
      await this.emailConsumerService.sendEmail({
        to: campaign.recipients,
        subject: campaign.subject,
        html: campaign.content,
        campaignId,
        campaign,
      });

      // Update campaign status to IN_PROGRESS
      await this.campaignStatusService.updateCampaign(campaignId, {
        status: CampaignStatus.IN_PROGRESS,
        sentCount: campaign.sentCount + campaign.recipients?.length || 0,
      });

      return { message: 'Campaign emails queued successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getAnalyticsOverview(userId: string): Promise<AnalyticsOverview> {
    try {
      // Get all campaigns for the user
      const campaigns = await this.campaignModel.find({ createdBy: userId });

      return {
        total_campaigns: campaigns?.length || 0,
        total_emails_sent:
          campaigns?.reduce((total, campaign) => {
            if (campaign.type === CampaignType.EMAIL) {
              return total + campaign.sentCount || 0;
            }
            return total;
          }, 0) || 0,
        total_sms_sent:
          campaigns?.reduce((total, campaign) => {
            if (campaign.type === CampaignType.SMS) {
              return total + campaign.sentCount || 0;
            }
            return total;
          }, 0) || 0,
        total_delivered:
          campaigns?.reduce((total, campaign) => {
            return total + campaign.deliveredCount || 0;
          }, 0) || 0,
      };
    } catch (error) {
      this.logger.error('Error getting analytics overview:', error);
      throw error;
    }
  }
}
