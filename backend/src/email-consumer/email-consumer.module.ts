import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import configuration from 'src/config/configuration';
import { EMAIL_SERVICE_NAME } from 'src/util/constants';
import { EmailConsumerController } from './email-consumer.controller';
import { EmailConsumerService } from './email-consumer.service';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),

    // producer config
    ClientsModule.registerAsync([
      {
        name: EMAIL_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('rabbitmq.email_queue'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => CampaignModule),
  ],
  controllers: [EmailConsumerController],
  providers: [EmailConsumerService],
  exports: [EmailConsumerService],
})
export class EmailConsumerModule {}
