import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CaroService } from './caro.service';

@WebSocketGateway()
export class CaroGateway {
  @WebSocketServer()
  server: Server;

  constructor(private caroService: CaroService) {}

  @SubscribeMessage('play')
  handlePlay(
    @MessageBody()
    data: { x: number; y: number; player: string },
  ) {
    const roomId = 'default'; // đơn giản, chỉ 1 phòng
    let board = this.caroService.getBoard(roomId);
    if (!board) {
      board = this.caroService.createBoard(roomId);
    }

    const ok = this.caroService.play(roomId, data.x, data.y, data.player);
    if (ok) {
      this.server.emit('board', board);
    }
  }
}
