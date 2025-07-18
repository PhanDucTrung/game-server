import { Module } from '@nestjs/common';
import { RoomService } from '../services/room.service';

@Module({
  providers: [RoomService],
  exports: [RoomService], 
})
export class RoomModule {}
