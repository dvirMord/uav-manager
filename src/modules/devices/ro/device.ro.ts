
import { DeviceState } from '../../../common/enums/device-state.enum';
import { ChannelType } from '../../../common/enums/channel-type.enum';

export interface ChannelRo {
    id: string;
    type: ChannelType;
    state: DeviceState;
    sourceUrl?: string;
    playbackUrl?: string;
    kafkaTopic?: string;
    kafkaPartition?: number;
}

export interface DeviceRo {
    id: string;
    name: string;
    state: DeviceState;
    channels: ChannelRo[];
}