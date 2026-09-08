import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DevicesStore } from "./devices.store";
import * as path from 'path';
import * as fs from 'fs';
import { CONFIG_DIRECTORY_NAME, DEVICES_CONFIG_FILE_NAME, FILE_ENCODING_UTF8, DEVICES_LOG_MESSAGES, DEVICES_ERROR_MESSAGES } from "../../common/constants/devices.constants";
import { ChannelConfig, DeviceConfig } from "./dto/device-config.dto";
import { DeviceRo } from "./ro/device.ro";
import { ChannelType } from "../../common/enums/channel-type.enum";

@Injectable()
export class DevicesService implements OnModuleInit {

    public constructor(
        private readonly devicesStore: DevicesStore,
        private readonly logger: Logger,
    ) { }

    public async onModuleInit(): Promise<void> {
        this.loadDevicesConfiguration();
    }

    // for endpoints
    public getAll(): DeviceRo[] {
        return this.devicesStore.getAll();
    }

    public getById(deviceId: string): DeviceRo | undefined {
        const device = this.devicesStore.getById(deviceId);
        if (!device) {
            throw new NotFoundException(DEVICES_ERROR_MESSAGES.NOT_FOUND(deviceId));
        }
        return device;
    }

    private mapChannel(rawChannel: ChannelConfig) {
        switch (rawChannel.type) {
            case ChannelType.MULTIMEDIA:
                return {
                    id: rawChannel.id,
                    type: rawChannel.type,
                    state: rawChannel.state,
                    sourceUrl: rawChannel.sourceUrl,
                    playbackUrl: undefined,
                }
            case ChannelType.TELEMETRY:
                return {
                    id: rawChannel.id,
                    type: rawChannel.type,
                    state: rawChannel.state,
                    kafkaTopic: rawChannel.kafkaTopic,
                    kafkaPartition: rawChannel.kafkaPartition,
                }
            default:
                this.logger.log("Undefind channel type", DevicesService.name);
        }
    }

    private loadDevicesConfiguration(): void {
        const configPath = path.resolve(process.cwd(), CONFIG_DIRECTORY_NAME, DEVICES_CONFIG_FILE_NAME);

        try {
            const filedata = fs.readFileSync(configPath, FILE_ENCODING_UTF8);

            const rawDevices: DeviceConfig[] = JSON.parse(filedata);

            const devices = rawDevices.map((rawDevice) => ({
                id: rawDevice.id,
                name: rawDevice.name,
                state: rawDevice.state,
                channels: rawDevice.channels.map((rawChannel) =>
                    this.mapChannel(rawChannel)
                ),
            }));
            this.devicesStore.saveAll(devices);
            this.logger.log(DEVICES_LOG_MESSAGES.LOAD_SUCCESS(devices.length, configPath), DevicesService.name);
        }
        catch (error) {
            this.logger.error(
                DEVICES_LOG_MESSAGES.LOAD_FAILED(configPath),
                error instanceof Error ? error.stack : String(error),
                DevicesService.name,
            );
        }
    }
}