import app from './app';
import aws from './aws';
import basicAuth from './basicAuth';
import crypto from './crypto';
import dynamodb from './dynamodb';
import jwt from './jwt';
import rds from './rds';
import s3 from './s3';
import secretsmanager from './secretsmanager';
import sqs from './sqs';
export { app, aws, basicAuth, crypto, dynamodb, jwt, rds, s3, secretsmanager, sqs, };
declare const _default: {
    app: {
        name: string;
        stackName: string;
        env: string;
        debug: boolean;
    };
    aws: {
        accountId: string | undefined;
        region: string;
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
        };
    };
    dynamodb: {
        region: string;
        tables: {
            alias: string;
            name: string;
        }[];
    };
    jwt: {
        algorithm: string;
        secrets: {
            keyid: string;
            secret: string;
        }[];
        expiresIn: string;
        issuer: string | undefined;
        audience: string | undefined;
        validateClaims: boolean;
    };
    rds: {
        aurora: {
            mysql: {
                region: string;
                databaseName: string | undefined;
                connectionType: string;
                dataApi: {
                    secretArn: string | undefined;
                    resourceArn: string | undefined;
                    maxAttempts: string | number;
                    requestTimeout: string | number;
                };
                proxy: {
                    dbCredentialsSecretId: string | undefined;
                };
            };
        };
    };
    s3: {
        region: string;
        bucket: string;
    };
    secretsmanager: {
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
};
export default _default;
