import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { CampaignType } from 'src/util/enums';

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CampaignType })
  @IsEnum(CampaignType)
  type: CampaignType;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;
}
