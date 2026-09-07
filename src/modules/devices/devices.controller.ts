import { Controller, Get, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceRo } from './ro/device.ro';
import {
    DEVICE_ID_PARAM,
    DEVICE_ID_ROUTE_PARAM,
} from '../../common/constants/devices.constants';

@Controller('devices')
export class DevicesController {
    public constructor(private readonly devicesService: DevicesService) { }

    @Get()
    public getAllDevices(): DeviceRo[] {
        return this.devicesService.getAll();
    }

    @Get(DEVICE_ID_ROUTE_PARAM)
    public getDeviceById(@Param(DEVICE_ID_PARAM) deviceId: string): DeviceRo {
        return this.devicesService.getById(deviceId);
    }
}