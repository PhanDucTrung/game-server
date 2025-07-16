import { Module } from '@nestjs/common';
import { RoomService } from './room.service';

@Module({
  providers: [RoomService],
  exports: [RoomService], // 👈 Export để module khác xài
})
export class RoomModule {}
