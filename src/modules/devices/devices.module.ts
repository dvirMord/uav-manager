import { Logger, Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesStore } from './devices.store';
import { MediaServerModule } from '../media-server/media-server.module';

@Module({
    imports: [MediaServerModule],
    controllers: [DevicesController],
    providers: [DevicesService, DevicesStore, Logger],
    exports: [DevicesStore],
})
export class DevicesModule { }