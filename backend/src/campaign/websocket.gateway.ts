import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Campaign } from './schemas/campaign.schema';

@WSGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyNewCampaign(campaign: Campaign) {
    this.server.emit('campaign.created', campaign);
  }

  notifyCampaignUpdate(campaign: Campaign) {
    this.server.emit('campaign.updated', campaign);
  }

  notifyCampaignStatus(campaignId: string, status: string, metrics?: any) {
    this.server.emit('campaign.status', { campaignId, status, ...metrics });
  }
}
