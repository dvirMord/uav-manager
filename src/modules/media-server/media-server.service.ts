import { StartStreamOptions } from './interfaces/media-server.interface';

export abstract class MediaServerService {
    /**
     * Starts ingestion for a given stream and returns the client playback URL (HLS).
     */
    abstract startStream(options: StartStreamOptions): Promise<string>;

    /**
     * Stops active stream ingestion on the media server.
     */
    abstract stopStream(streamName: string): Promise<void>;
}