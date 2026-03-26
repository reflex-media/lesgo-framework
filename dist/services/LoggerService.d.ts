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
    consoleLogger(level: LogLevel, message: string): void | null;
    checkIsLogRequired(transportName: string, level: LogLevel): boolean;
    structureLogMessage(level: LogLevel, message: any, extra: object): {
        level: LogLevel;
        message: any;
        logger: string;
        extra: {};
    };
    refineMessagePerTransport(transportName: string, message: any): any;
    getTransportByName(transportName: string): Transport | undefined;
    /**
     * Sanitizes an object for JSON serialization by:
     * - Replacing functions with a string representation (similar to console.log behavior)
     * - Handling circular references
     * - Preserving other values
     */
    sanitizeForJson(obj: any, seen?: WeakSet<object>): any;
}
export {};
