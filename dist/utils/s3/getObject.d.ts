import { GetObjectOptions } from '../../services/S3Service/getObject';
import { ClientOptions } from '../../types/aws';
/**
 * Retrieves an object from S3 based on the provided key.
 *
 * @param key - The key of the object to retrieve.
 * @param opts - Optional parameters for retrieving the object.
 * @param clientOpts - Optional client options for the S3 client.
 * @returns A Promise that resolves to the body of the retrieved object.
 */
declare const getObject: (key: string, opts?: GetObjectOptions, clientOpts?: ClientOptions) => Promise<Buffer<ArrayBufferLike>>;
export default getObject;
