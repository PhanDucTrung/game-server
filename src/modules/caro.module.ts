import { Module } from '@nestjs/common';
import { CaroGateway } from '../gateways/caro.gateway';
import { RoomModule } from './room.module';

@Module({
  imports: [RoomModule], // 👈 Import để có RoomService
  providers: [CaroGateway],
})
export class CaroModule {}
