export const CONFIG_DIRECTORY_NAME = 'config';
export const DEVICES_CONFIG_FILE_NAME = 'devices.config.json';
export const FILE_ENCODING_UTF8 = 'utf8';

export const DEVICES_LOG_MESSAGES = {
    LOAD_SUCCESS: (count: number, filePath: string) =>
        `Loaded ${count} devices from configuration file: ${filePath}`,
    LOAD_FAILED: (filePath: string) =>
        `Failed to load devices configuration from file: ${filePath}`,
} as const;