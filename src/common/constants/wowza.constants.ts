export const WOWZA_CONFIG_KEYS = {
    HOST: 'WOWZA_HOST',
    REST_PORT: 'WOWZA_REST_PORT',
    STREAMING_PORT: 'WOWZA_STREAMING_PORT',
    USERNAME: 'WOWZA_USERNAME',
    PASSWORD: 'WOWZA_PASSWORD',
} as const;

export const WOWZA_DEFAULTS = {
    SERVER_NAME: '_defaultServer_',
    VHOST_NAME: '_defaultVHost_',
    APP_NAME: 'live',
    APP_INSTANCE: '_definst_',
    MEDIA_CASTER_TYPE: 'rtp',
    HOST: 'localhost',
    REST_PORT: 8087,
    STREAMING_PORT: 1936,
    USERNAME: 'admin',
    PASSWORD: 'admin123',
} as const;

export const WOWZA_HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
} as const;

export const WOWZA_HTTP_HEADERS = {
    ACCEPT: 'Accept',
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
    APPLICATION_JSON: 'application/json',
    BASIC_PREFIX: 'Basic ',
} as const;

export const WOWZA_STREAM_EXTENSIONS = {
    STREAM_SUFFIX: '.stream',
    ACTIVE_STREAM_SUFFIX: '.stream.stream',
    HLS_PLAYLIST_FILE: 'playlist.m3u8',
} as const;

export const WOWZA_QUERY_PARAMS = {
    CONNECT_APP_NAME: 'connectAppName',
    APP_INSTANCE: 'appInstance',
    MEDIA_CASTER_TYPE: 'mediaCasterType',
} as const;

export const WOWZA_LOG_MESSAGES = {
    STARTING_STREAM: (streamName: string, sourceUrl: string) =>
        `Starting stream '${streamName}' from source: ${sourceUrl}`,
    STREAM_LIVE: (streamName: string, playbackUrl: string) =>
        `Stream '${streamName}' is live at: ${playbackUrl}`,
    STOPPING_STREAM: (streamName: string) =>
        `Stopping incoming stream '${streamName}'`,
    WARN_CREATE_FAILED: (streamName: string, error: string) =>
        `Could not create stream file '${streamName}': ${error}`,
    WARN_DISCONNECT_FAILED: (streamName: string, error: string) =>
        `Failed to disconnect stream '${streamName}': ${error}`,
} as const;

export const WOWZA_ERROR_MESSAGES = {
    CONNECT_FAILED: (streamFileName: string, error: string) =>
        `Failed to connect stream '${streamFileName}': ${error}`,
} as const;

export const WOWZA_ENDPOINTS = {
    /**
     * Base collection endpoint for Stream Files.
     * POST: Create file | GET: List files
     */
    STREAM_FILES: (appName: string = WOWZA_DEFAULTS.APP_NAME) =>
        `/v2/servers/${WOWZA_DEFAULTS.SERVER_NAME}/vhosts/${WOWZA_DEFAULTS.VHOST_NAME}/applications/${appName}/streamfiles`,

    /**
     * Specific Stream File endpoint.
     * GET: Details | DELETE: Remove configuration
     */
    STREAM_FILE_BY_NAME: (
        streamFileName: string,
        appName: string = WOWZA_DEFAULTS.APP_NAME,
    ) =>
        `/v2/servers/${WOWZA_DEFAULTS.SERVER_NAME}/vhosts/${WOWZA_DEFAULTS.VHOST_NAME}/applications/${appName}/streamfiles/${streamFileName}`,

    /**
     * Connect action: Ingests the RTSP source into incoming streams.
     */
    CONNECT_STREAM: (
        streamFileName: string,
        appName: string = WOWZA_DEFAULTS.APP_NAME,
        appInstance: string = WOWZA_DEFAULTS.APP_INSTANCE,
        mediaCasterType: string = WOWZA_DEFAULTS.MEDIA_CASTER_TYPE,
    ) =>
        `/v2/servers/${WOWZA_DEFAULTS.SERVER_NAME}/vhosts/${WOWZA_DEFAULTS.VHOST_NAME}/applications/${appName}/streamfiles/${streamFileName}/actions/connect?${WOWZA_QUERY_PARAMS.CONNECT_APP_NAME}=${appName}&${WOWZA_QUERY_PARAMS.APP_INSTANCE}=${appInstance}&${WOWZA_QUERY_PARAMS.MEDIA_CASTER_TYPE}=${mediaCasterType}`,

    /**
     * Disconnect action: Kills the active incoming stream.
     */
    DISCONNECT_STREAM: (
        activeStreamName: string,
        appName: string = WOWZA_DEFAULTS.APP_NAME,
        appInstance: string = WOWZA_DEFAULTS.APP_INSTANCE,
    ) =>
        `/v2/servers/${WOWZA_DEFAULTS.SERVER_NAME}/vhosts/${WOWZA_DEFAULTS.VHOST_NAME}/applications/${appName}/instances/${appInstance}/incomingstreams/${activeStreamName}/actions/disconnectStream`,

    /**
     * Generates client-facing HLS playlist URL.
     */
    PLAYBACK_HLS_URL: (
        host: string,
        port: number,
        streamName: string,
        appName: string = WOWZA_DEFAULTS.APP_NAME,
    ) =>
        `http://${host}:${port}/${appName}/${streamName}/${WOWZA_STREAM_EXTENSIONS.HLS_PLAYLIST_FILE}`,
};