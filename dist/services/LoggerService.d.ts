type LogLevel = 'error' | 'warn' | 'notice' | 'info' | 'debug';
interface LoggerServiceOptions {
    logger?: string;
    defaultMeta?: object;
    transports?: Array<Transport>;
}
interface Transport {
    logType: string;
    level: string;
    config?: TransportConfig;
}
interface TransportConfig {
    getCreatedAt?: boolean;
    meta?: object;
    tags?: TransportConfigTags;
}
interface TransportConfigTags {
    [key: string]: string;
}
export default class LoggerService {
    logger: string;
    meta: object;
    transports: Array<Transport>;
    logLevels: {
        [key: string]: number;
    };
    constructor(opts?: LoggerServiceOptions);
    log(level: LogLevel, message: string, extra?: {}): void;
    error(message: string, extra?: {}): void;
    warn(message: string, extra?: {}): void;
    info(message: string, extra?: {}): void;
    debug(message: string, extra?: {}): void;
    notice(message: string, extra?: {}): void;
    addMeta(meta?: {}): void;
    checkIsLogRequired(transportName: string, level: LogLevel): boolean;
    structureLogMessage(level: LogLevel, message: string, extra: object): {
        level: LogLevel;
        message: string;
        logger: string;
        extra: {};
    };
    getTransportByName(transportName: string): Transport | undefined;
}
export {};
