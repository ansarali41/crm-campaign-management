import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PASSPORT_STRATEGY_NAME } from 'src/util/constants';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(AuthGuard(PASSPORT_STRATEGY_NAME))
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    try {
      const campaign = await this.campaignService.create(
        createCampaignDto,
        req?.user?.userId,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Campaign created successfully',
        data: campaign,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Return all campaigns' })
  async findAll(@Query() query: any) {
    try {
      const campaigns = await this.campaignService.findAll(query);

      return {
        statusCode: HttpStatus.OK,
        message: 'Campaigns fetched successfully',
        data: campaigns,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by id' })
  @ApiResponse({ status: 200, description: 'Get a campaign details by id' })
  async findOne(@Param('id') id: string) {
    try {
      const campaign = await this.campaignService.findOne(id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Campaign fetched successfully',
        data: campaign,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign by id' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: Partial<CreateCampaignDto>,
  ) {
    try {
      const campaign = await this.campaignService.update(id, updateCampaignDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Campaign updated successfully',
        data: campaign,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign by id' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  async remove(@Param('id') id: string) {
    try {
      const campaign = await this.campaignService.delete(id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Campaign deleted successfully',
        data: campaign,
      };
    } catch (error) {
      throw error;
    }
  }
}
