import { DeviceState } from '../../../common/enums/device-state.enum';
import { ChannelType } from '../../../common/enums/channel-type.enum';

export interface ChannelConfig {
    id: string;
    type: ChannelType;
    state: DeviceState;
    sourceUrl?: string;
    kafkaTopic?: string;
    kafkaPartition?: number;
}

export interface DeviceConfig {
    id: string;
    name: string;
    state: DeviceState;
    channels: ChannelConfig[];
}