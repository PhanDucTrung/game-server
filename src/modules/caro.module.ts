import { Module } from '@nestjs/common';
import { CaroService } from '../services/caro.service';
import { CaroGateway } from '../gateways/caro.gateway';
import { RoomService } from '../services/room.service';
import { RoomModule } from './room.module';

@Module({
  providers: [CaroGateway, CaroService,RoomService],
})
export class CaroModule {}

