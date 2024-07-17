import app from './app';
import aws from './aws';
import basicAuth from './basicAuth';
import crypto from './crypto';
import jwt from './jwt';
export { app, aws, basicAuth, crypto, jwt };
declare const _default: {
    app: {
        name: string;
        env: string;
        debug: boolean;
    };
    aws: {
        region: string;
        s3: {
            bucket: string;
            region: string;
        };
        sqs: {
            region: string;
            queues: {
                alias: string;
                name: string;
                url: string;
            }[];
        };
        dynamodb: {
            region: string;
            tables: {
                alias: string;
                name: string;
            }[];
        };
    };
    basicAuth: {
        authorizedList: {
            username: string;
            password: string;
        }[];
    };
    crypto: {
        hash: {
            algorithm: string;
        };
        encryption: {
            algorithm: string;
            secretKey: string | undefined;
            ivLength: number;
        };
    };
    jwt: {
        algorithm: string;
        secrets: {
            keyid: string;
            secret: string;
        }[];
        expiresIn: string;
        issuer: string;
        audience: string;
        validateClaims: boolean;
    };
};
export default _default;
