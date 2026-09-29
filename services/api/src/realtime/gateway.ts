import { Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import { logger } from '@aip/logger';

export class RealtimeGateway {
  private io: SocketIOServer | null = null;

  public attach(httpServer: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      logger.info({ module: 'realtime', action: 'client_connected', socketId: socket.id }, 'Realtime client connected.');
      
      socket.on('disconnect', (reason) => {
        logger.info({ module: 'realtime', action: 'client_disconnected', socketId: socket.id, reason }, 'Realtime client disconnected.');
      });
    });

    logger.info({ module: 'realtime', action: 'init' }, 'Socket.IO realtime gateway attached to HTTP server.');
    return this.io;
  }

  public getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const realtimeGateway = new RealtimeGateway();
export default realtimeGateway;
