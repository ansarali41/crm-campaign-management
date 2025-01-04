import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailConsumerService } from './email-consumer.service';

interface EmailMessage {
  to: string[];
  subject: string;
  html: string;
  campaignId: string;
}

@Controller()
export class EmailConsumerController {
  constructor(private readonly emailConsumerService: EmailConsumerService) {}

  @EventPattern('send_email')
  async handleSendEmail(@Payload() data: EmailMessage) {
    try {
      await this.emailConsumerService.processSendEmailQueue(data);
    } catch (error) {
      console.error('Error processing email queue:', error?.stack);
      throw error;
    }
  }
}
