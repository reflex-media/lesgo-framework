export interface invokeCommandMiddlewareOptions {
    [key: string]: any;
}
declare const disconnectOpenConnectionsMiddleware: (opts?: invokeCommandMiddlewareOptions) => {
    after: () => Promise<void>;
    onError: () => Promise<void>;
};
export default disconnectOpenConnectionsMiddleware;
