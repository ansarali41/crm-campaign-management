import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { CampaignStatus, CampaignType } from 'src/util/enums';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: CampaignType })
  type: CampaignType;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], required: true })
  recipients: string[];

  @Prop()
  scheduledAt: Date;

  @Prop({ default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ default: 0 })
  sentCount: number;

  @Prop({ default: 0 })
  failedCount: number;

  @Prop({ default: 0 })
  openCount: number;

  @Prop({ type: Map, of: String })
  metadata: Record<string, any>;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
