import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';
import { CampaignStatusService } from 'src/campaign/campaign-status.service';
import { EMAIL_SERVICE_NAME } from 'src/util/constants';
import { CampaignStatus } from 'src/util/enums';
import { SendEmailParams } from 'src/util/interfaces';

@Injectable()
export class EmailConsumerService {
  private readonly logger = new Logger(EmailConsumerService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(EMAIL_SERVICE_NAME)
    private readonly emailClient: ClientProxy,
    private readonly campaignStatusService: CampaignStatusService,
  ) {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    try {
      const { to, subject, html, campaignId, campaign } = params;

      // Emit event to RabbitMQ queue
      this.emailClient.emit('send_email', {
        to,
        subject,
        html,
        campaignId,
        campaign,
      });

      this.logger.log(`Email queued for sending to ${to?.length} recipients`);
    } catch (error) {
      this.logger.error(`Failed to queue email: ${error?.message}`);
      throw error;
    }
  }

  async processSendEmailQueue(emailData: SendEmailParams) {
    const { to, subject, html, campaignId, campaign } = emailData;

    try {
      // Send emails to each recipient
      const emailPromises = to?.map(async (recipient) => {
        await this.transporter.sendMail({
          to: recipient,
          subject: subject,
          html: `<!DOCTYPE html>
          <html>
          <head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f2f2f2;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                  }
                  h1 {
                      color: #333333;
                  }
                  p {
                      color: #666666;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  ${html}
              </div>
          </body>
          </html>`,
        });
        this.logger.log(`Email sent successfully to ${recipient}`);
      });

      await Promise.all(emailPromises);
      this.logger.log('All emails sent successfully');
      // update campaign status
      // update campaign sent count
      await this.campaignStatusService.updateCampaign(campaignId, {
        status: CampaignStatus.COMPLETED,
        deliveredCount: campaign?.deliveredCount + to?.length || 0,
      });
    } catch (error) {
      this.logger.error(`Failed to send email: ${error?.message}`);
      // update campaign status to failed
      await this.campaignStatusService.updateCampaign(campaignId, {
        status: CampaignStatus.FAILED,
        failedCount: campaign?.failedCount + to?.length || 0,
      });
      throw error;
    }
  }
}
