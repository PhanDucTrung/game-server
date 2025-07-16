import { Module } from '@nestjs/common';
import { CaroGateway } from './caro.gateway';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule], // 👈 Import để có RoomService
  providers: [CaroGateway],
})
export class CaroModule {}
