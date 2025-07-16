import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.contronller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
