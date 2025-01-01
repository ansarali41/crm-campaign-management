import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CampaignStatus, CampaignType } from 'src/util/enums';
import {
  Campaign,
  CampaignDocument,
} from '../campaign/schemas/campaign.schema';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    private configService: ConfigService,
  ) {}

  async processCampaign(campaignData: any) {
    const campaign = await this.campaignModel.findById(campaignData.id);
    if (!campaign) return;

    try {
      await this.updateCampaignStatus(campaign.id, CampaignStatus.IN_PROGRESS);

      for (const recipient of campaign.recipients) {
        try {
          if (campaign.type === CampaignType.EMAIL) {
            await this.sendEmail(recipient, campaign.content);
          } else {
            await this.sendSMS(recipient, campaign.content);
          }

          await this.campaignModel.findByIdAndUpdate(campaign.id, {
            $inc: { sentCount: 1 },
          });
        } catch (error) {
          await this.campaignModel.findByIdAndUpdate(campaign.id, {
            $inc: { failedCount: 1 },
          });
          console.error(`Failed to send to ${recipient}:`, error);
        }
      }

      await this.updateCampaignStatus(campaign.id, CampaignStatus.COMPLETED);
    } catch (error) {
      await this.updateCampaignStatus(campaign.id, CampaignStatus.FAILED);
      console.error('Campaign processing failed:', error);
    }
  }

  private async updateCampaignStatus(id: string, status: CampaignStatus) {
    return this.campaignModel.findByIdAndUpdate(id, { status });
  }

  private async sendEmail(recipient: string, content: string) {
    // Implement email sending logic using nodemailer or similar
    // This is a placeholder
    console.log(`Sending email to ${recipient}: ${content}`);
  }

  private async sendSMS(recipient: string, content: string) {
    // Implement SMS sending logic using Twilio or similar
    // This is a placeholder
    console.log(`Sending SMS to ${recipient}: ${content}`);
  }
}
