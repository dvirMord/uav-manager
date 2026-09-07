import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WOWZA_STREAM_EXTENSIONS, WOWZA_LOG_MESSAGES, WOWZA_CONFIG_KEYS, WOWZA_DEFAULTS, WOWZA_ENDPOINTS, WOWZA_HTTP_METHODS, WOWZA_ERROR_MESSAGES, WOWZA_HTTP_HEADERS } from '../../common/constants/wowza.constants';
import { StartStreamOptions } from './interfaces/media-server.interface';
import { MediaServerService } from './media-server.service';


@Injectable()
export class WowzaMediaServerService extends MediaServerService {
    private readonly logger = new Logger(WowzaMediaServerService.name);

    constructor(private readonly configService: ConfigService) {
        super();
    }

    async startStream(options: StartStreamOptions): Promise<string> {
        const { streamName, sourceUrl } = options;

        const cleanStreamName = streamName.endsWith(WOWZA_STREAM_EXTENSIONS.STREAM_SUFFIX)
            ? streamName.slice(0, -WOWZA_STREAM_EXTENSIONS.STREAM_SUFFIX.length)
            : streamName;

        const streamFileName = `${cleanStreamName}${WOWZA_STREAM_EXTENSIONS.STREAM_SUFFIX}`;
        const activeStreamName = `${cleanStreamName}${WOWZA_STREAM_EXTENSIONS.ACTIVE_STREAM_SUFFIX}`;

        this.logger.log(
            WOWZA_LOG_MESSAGES.STARTING_STREAM(cleanStreamName, sourceUrl),
        );

        //Create stream file definition using the full file name (.stream)
        await this.createStreamFile(streamFileName, sourceUrl);

        // Trigger connect on the exact same stream file definition
        await this.connectStream(streamFileName);

        const host = this.configService.get<string>(
            WOWZA_CONFIG_KEYS.HOST,
            WOWZA_DEFAULTS.HOST,
        );
        const streamingPort = this.configService.get<number>(
            WOWZA_CONFIG_KEYS.STREAMING_PORT,
            WOWZA_DEFAULTS.STREAMING_PORT,
        );

        //Playback URL points to the live incoming stream name (.stream.stream)
        const playbackUrl = WOWZA_ENDPOINTS.PLAYBACK_HLS_URL(
            host,
            streamingPort,
            activeStreamName,
        );

        this.logger.log(
            WOWZA_LOG_MESSAGES.STREAM_LIVE(cleanStreamName, playbackUrl),
        );

        return playbackUrl;
    }

    async stopStream(streamName: string): Promise<void> {
        const cleanStreamName = streamName.endsWith(WOWZA_STREAM_EXTENSIONS.STREAM_SUFFIX)
            ? streamName.slice(0, -WOWZA_STREAM_EXTENSIONS.STREAM_SUFFIX.length)
            : streamName;

        const activeStreamName = `${cleanStreamName}${WOWZA_STREAM_EXTENSIONS.ACTIVE_STREAM_SUFFIX}`;

        this.logger.log(
            WOWZA_LOG_MESSAGES.STOPPING_STREAM(activeStreamName),
        );

        await this.disconnectStream(activeStreamName);
    }

    private async createStreamFile(streamName: string, rtspUri: string): Promise<void> {
        const path = WOWZA_ENDPOINTS.STREAM_FILES();
        const body = {
            name: streamName,
            serverName: WOWZA_DEFAULTS.SERVER_NAME,
            uri: rtspUri,
        };

        const response = await this.sendWowzaRequest(
            path,
            WOWZA_HTTP_METHODS.POST,
            body,
        );

        if (!response.ok && response.status !== HttpStatus.CONFLICT) {
            const errorText = await response.text();
            this.logger.warn(
                WOWZA_LOG_MESSAGES.WARN_CREATE_FAILED(streamName, errorText),
            );
        }
    }

    private async connectStream(streamFileName: string): Promise<void> {
        const path = WOWZA_ENDPOINTS.CONNECT_STREAM(streamFileName);
        const response = await this.sendWowzaRequest(
            path,
            WOWZA_HTTP_METHODS.PUT,
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                WOWZA_ERROR_MESSAGES.CONNECT_FAILED(streamFileName, errorText),
            );
        }
    }

    private async disconnectStream(activeStreamName: string): Promise<void> {
        const path = WOWZA_ENDPOINTS.DISCONNECT_STREAM(activeStreamName);
        const response = await this.sendWowzaRequest(
            path,
            WOWZA_HTTP_METHODS.PUT,
        );

        if (!response.ok && response.status !== HttpStatus.NOT_FOUND) {
            const errorText = await response.text();
            this.logger.warn(
                WOWZA_LOG_MESSAGES.WARN_DISCONNECT_FAILED(activeStreamName, errorText),
            );
        }
    }

    private async sendWowzaRequest(
        endpointPath: string,
        method: string,
        body?: Record<string, any>,
    ): Promise<Response> {
        const host = this.configService.get<string>(
            WOWZA_CONFIG_KEYS.HOST,
            WOWZA_DEFAULTS.HOST,
        );
        const restPort = this.configService.get<number>(
            WOWZA_CONFIG_KEYS.REST_PORT,
            WOWZA_DEFAULTS.REST_PORT,
        );
        const username = this.configService.get<string>(
            WOWZA_CONFIG_KEYS.USERNAME,
            WOWZA_DEFAULTS.USERNAME,
        );
        const password = this.configService.get<string>(
            WOWZA_CONFIG_KEYS.PASSWORD,
            WOWZA_DEFAULTS.PASSWORD,
        );

        const url = `http://${host}:${restPort}${endpointPath}`;
        const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');
        const authHeader = `${WOWZA_HTTP_HEADERS.BASIC_PREFIX}${encodedAuth}`;

        return fetch(url, {
            method,
            headers: {
                [WOWZA_HTTP_HEADERS.ACCEPT]: WOWZA_HTTP_HEADERS.APPLICATION_JSON,
                [WOWZA_HTTP_HEADERS.CONTENT_TYPE]: WOWZA_HTTP_HEADERS.APPLICATION_JSON,
                [WOWZA_HTTP_HEADERS.AUTHORIZATION]: authHeader,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}