import app from './app';
import aws from './aws';
import crypto from './crypto';
import jwt from './jwt';
export { app, aws, crypto, jwt };
declare const _default: {
    app: {
        name: string;
        env: string;
        debug: boolean;
    };
    aws: {
        region: string;
    };
    crypto: {
        hash: {
            algorithm: string;
        };
        encryption: {
            algorithm: string;
            secretKey: string;
            ivLength: number;
        };
    };
    jwt: {
        secret: string;
        iss: {
            validate: true;
            data: string[];
        };
        customClaims: {
            validate: true;
            data: string[];
        };
    };
};
export default _default;
