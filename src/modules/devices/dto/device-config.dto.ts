import { DeviceState } from '../../../common/enums/device-state.enum';
import { ChannelType } from '../../../common/enums/channel-type.enum';

export abstract class IChannelConfig {
    id: string;
    abstract type: ChannelType;
    state: DeviceState;
}

export class MultimediaChannelConfig extends IChannelConfig {
    type: ChannelType.MULTIMEDIA;
    sourceUrl: string;
}

export class TelemetryChannelConfig extends IChannelConfig {
    type: ChannelType.TELEMETRY;
    kafkaTopic: string;
    kafkaPartition: number;
}
export type ChannelConfig = MultimediaChannelConfig | TelemetryChannelConfig;
export interface DeviceConfig {
    id: string;
    name: string;
    state: DeviceState;
    channels: ChannelConfig[];
}