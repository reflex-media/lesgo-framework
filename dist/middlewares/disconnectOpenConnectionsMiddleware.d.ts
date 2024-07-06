declare const disconnectOpenConnectionsMiddleware: () => {
    after: () => Promise<void>;
    onError: () => Promise<void>;
};
export default disconnectOpenConnectionsMiddleware;
