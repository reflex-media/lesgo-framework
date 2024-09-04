export interface DisconnectMiddlewareOptions {
    clients?: any[];
}
declare const disconnectMiddleware: (opts?: DisconnectMiddlewareOptions) => {
    after: () => Promise<void>;
    onError: () => Promise<void>;
};
export default disconnectMiddleware;
