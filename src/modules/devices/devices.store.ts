import { DeviceRo } from './ro/device.ro';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesStore {
    // All the devices are stored in a Map with the device ID as the key and the DeviceRo object as the value.
    private readonly devices = new Map<string, DeviceRo>();

    // saving a single device to the store
    public save(Device: DeviceRo): void {
        this.devices.set(Device.id, Device);
    }

    // saving multiple devices to the store
    public saveAll(devices: DeviceRo[]): void {
        devices.forEach((Device) => this.save(Device));
    }

    // getting all devices ROs from the store
    public getAll(): DeviceRo[] {
        return Array.from(this.devices.values());
    }

    // getting a single device RO by its ID from the store
    public getById(id: string): DeviceRo | undefined {
        return this.devices.get(id);
    }

    // updating a device RO HLS in the store
    public updateChannelPlaybackUrl(deviceId: string, channelId: string,
        playbackUrl: string): void {
        const device = this.getById(deviceId);
        if (!device) { return; }

        const channel = device.channels.find(ch => ch.id === channelId);
        if (channel) {
            channel.playbackUrl = playbackUrl;
        }
    }

}