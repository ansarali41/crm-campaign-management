import { io, Socket } from 'socket.io-client';
import { Campaign } from '@/store/campaign.store';

interface ServerToClientEvents {
    'campaign:new': (campaign: Campaign) => void;
    'campaign:update': (campaign: Campaign) => void;
}

interface ClientToServerEvents {
    'subscribe:campaigns': () => void;
}

class SocketService {
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

    connect() {
        if (!this.socket) {
            this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
                auth: {
                    token: localStorage.getItem('token'),
                },
            });

            this.socket.on('connect', () => {
                console.log('Connected to WebSocket server');
                this.socket?.emit('subscribe:campaigns');
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server');
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        if (!this.socket) {
            return this.connect();
        }
        return this.socket;
    }
}

export const socketService = new SocketService();
