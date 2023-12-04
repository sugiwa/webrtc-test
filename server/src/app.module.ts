import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebrtcModule } from './webrtc/webrtc.module';

@Module({
  imports: [WebrtcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
