import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users.module';
import { RoomModule } from './room.module';
import { CaroModule } from './caro.module';
import { Line98Gateway } from '../gateways/line98.gateway';
import { CaroGateway } from '../gateways/caro.gateway';
import { Line98Service } from '../services/line98.service';
import { CaroService } from '../services/caro.service';
import { RootController } from '../controllers/root.cotroller';

@Module({
  imports: [
  ServeStaticModule.forRoot({
   rootPath: join(process.cwd(), 'frontend'),
    }),
    UsersModule,
    RoomModule,
    CaroModule
  ],
   controllers: [RootController],
  providers: [Line98Gateway, CaroGateway, Line98Service, CaroService],
})
export class AppModule {}
