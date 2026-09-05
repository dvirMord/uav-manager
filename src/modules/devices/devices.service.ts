import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DevicesStore } from "./devices.store";
import * as path from 'path';
import * as fs from 'fs';
import { CONFIG_DIRECTORY_NAME, DEVICES_CONFIG_FILE_NAME, FILE_ENCODING_UTF8, DEVICES_LOG_MESSAGES } from "../../common/constants/devices.constants";
import { DeviceConfig } from "./dto/device-config.dto";

@Injectable()
export class DevicesService implements OnModuleInit {
    private readonly logger = new Logger(DevicesService.name);

    public constructor(private readonly devicesStore: DevicesStore) { }

    public async onModuleInit(): Promise<void> {
        this.loadDevicesConfiguration();
    }

    private loadDevicesConfiguration(): void {
        const configPath = path.resolve(process.cwd(), CONFIG_DIRECTORY_NAME, DEVICES_CONFIG_FILE_NAME);

        try {
            const filedata = fs.readFileSync(configPath, FILE_ENCODING_UTF8);

            const rawdevices: DeviceConfig[] = JSON.parse(filedata);

            const devices = rawdevices.map((rawdevice) => ({
                id: rawdevice.id,
                name: rawdevice.name,
                state: rawdevice.state,
                channels: rawdevice.channels.map((rawchannel) => ({
                    id: rawchannel.id,
                    type: rawchannel.type,
                    state: rawchannel.state,
                    sourceUrl: rawchannel.sourceUrl,
                    kafkaTopic: rawchannel.kafkaTopic,
                    kafkaPartition: rawchannel.kafkaPartition,
                    playbackUrl: undefined,
                })),
            }));
            this.devicesStore.saveAll(devices);
            this.logger.log(DEVICES_LOG_MESSAGES.LOAD_SUCCESS(devices.length, configPath));
        }
        catch (error) {
            this.logger.error(DEVICES_LOG_MESSAGES.LOAD_FAILED(configPath), error);
        }
    }
}