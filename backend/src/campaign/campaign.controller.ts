import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    try {
      return await this.campaignService.create(
        createCampaignDto,
        req?.user?.userId,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Return all campaigns' })
  async findAll(@Query() query: any) {
    try {
      return await this.campaignService.findAll(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by id' })
  @ApiResponse({ status: 200, description: 'Get a campaign details by id' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.campaignService.findOne(id);
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
      return await this.campaignService.update(id, updateCampaignDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign by id' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  async remove(@Param('id') id: string) {
    try {
      return await this.campaignService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
