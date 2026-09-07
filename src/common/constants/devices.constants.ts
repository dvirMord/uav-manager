export const CONFIG_DIRECTORY_NAME = 'config';
export const DEVICES_CONFIG_FILE_NAME = 'devices.config.json';
export const FILE_ENCODING_UTF8 = 'utf8';

export const DEVICE_ID_PARAM = 'id';
export const DEVICE_ID_ROUTE_PARAM = `:${DEVICE_ID_PARAM}`;

export const DEVICES_LOG_MESSAGES = {
    LOAD_SUCCESS: (count: number, filePath: string) =>
        `Loaded ${count} devices from configuration file: ${filePath}`,
    LOAD_FAILED: (filePath: string) =>
        `Failed to load devices configuration from file: ${filePath}`,
} as const;

export const DEVICES_ERROR_MESSAGES = {
    NOT_FOUND: (id: string) => `Device with ID '${id}' was not found.`,
} as const;

export const DEFAULT_APP_PORT = 3000;

export const SWAGGER_CONFIG = {
    PATH: 'api',
    TITLE: 'RAVEN - UAV Manager API',
    DESCRIPTION: 'API documentation for RAVEN UAV Manager service',
    VERSION: '1.0',
    TAGS: {
        DEVICES: 'devices',
    },
} as const;

export const APP_LOG_MESSAGES = {
    BOOTSTRAP_ERROR: 'Fatal error during bootstrap:',
} as const;

export const CHANNEL_TYPES = {
    MULTIMEDIA: 'multimedia',
} as const;

export const GENERATE_STREAM_NAME = (deviceId: string, channelId: string): string =>
    `${deviceId}_${channelId}`;

// Add these to your existing DEVICES_LOG_MESSAGES object:
export const DEVICES_STREAM_LOG_MESSAGES = {
    STREAM_INIT_SUCCESS: (deviceId: string, channelId: string, playbackUrl: string) =>
        `Successfully initialized stream for device '${deviceId}', channel '${channelId}': ${playbackUrl}`,
    STREAM_INIT_FAILED: (deviceId: string, channelId: string) =>
        `Failed to initialize stream for device '${deviceId}', channel '${channelId}'`,
} as const;