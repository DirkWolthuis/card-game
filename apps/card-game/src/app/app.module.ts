import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventBusService } from './event-bus.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventBusService],
})
export class AppModule {}
