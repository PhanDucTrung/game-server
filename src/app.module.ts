import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { RoomModule } from './room/room.module';
import { CaroModule } from './caro/caro.module';
import { Line98Gateway } from './line98/line98.gateway';
import { CaroGateway } from './caro/caro.gateway';
import { Line98Service } from './line98/line98.service';
import { CaroService } from './caro/caro.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    UsersModule,
    RoomModule,
    CaroModule
  ],
  providers: [Line98Gateway, CaroGateway, Line98Service, CaroService],
})
export class AppModule {}
