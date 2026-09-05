import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesStore } from './devices.store';

@Module({
    controllers: [DevicesController],
    providers: [DevicesService, DevicesStore],
    exports: [DevicesStore],
})
export class DevicesModule { }