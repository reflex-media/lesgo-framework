import disconnectOpenConnectionsMiddleware from './disconnectOpenConnectionsMiddleware';
import httpMiddleware from './httpMiddleware';
import httpResponseMiddleware from './httpResponseMiddleware';
import invokeCommandMiddleware from './invokeCommandMiddleware';
import sqsMiddleware from './sqsMiddleware';
import verifyBasicAuthMiddleware from './verifyBasicAuthMiddleware';
import verifyJwtMiddleware from './verifyJwtMiddleware';
export { disconnectOpenConnectionsMiddleware, httpMiddleware, httpResponseMiddleware, invokeCommandMiddleware, sqsMiddleware, verifyBasicAuthMiddleware, verifyJwtMiddleware, };
declare const _default: {
    disconnectOpenConnectionsMiddleware: (opts?: import("./disconnectOpenConnectionsMiddleware").invokeCommandMiddlewareOptions | undefined) => {
        after: () => Promise<void>;
        onError: () => Promise<void>;
    };
    httpMiddleware: (opts?: import("./httpMiddleware").HttpMiddlewareOptions) => {
        before: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        after: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        onError: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
    };
    httpResponseMiddleware: (opts?: import("./httpMiddleware").HttpMiddlewareOptions) => {
        after: (request: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        onError: (request: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
    };
    invokeCommandMiddleware: (opts?: import("./invokeCommandMiddleware").invokeCommandMiddlewareOptions) => {
        before: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        after: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        onError: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
    };
    sqsMiddleware: () => {
        before: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        after: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
        onError: (handler: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => Promise<void>;
    };
    verifyBasicAuthMiddleware: (options?: import("./verifyBasicAuthMiddleware").VerifyBasicAuthMiddlewareOptions) => {
        before: (request: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => void;
    };
    verifyJwtMiddleware: (secret?: string | undefined, options?: import("../services/JWTService/verify").VerifyInputOptions | undefined) => {
        before: (request: import("@middy/core").Request<any, any, Error, import("aws-lambda").Context, {}>) => void;
    };
};
export default _default;
