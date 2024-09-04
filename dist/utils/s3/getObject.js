var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import getObjectService, {
  streamToBuffer,
} from '../../services/S3Service/getObject';
/**
 * Retrieves an object from S3 based on the provided key.
 *
 * @param key - The key of the object to retrieve.
 * @param opts - Optional parameters for retrieving the object.
 * @param clientOpts - Optional client options for the S3 client.
 * @returns A Promise that resolves to the body of the retrieved object.
 */
const getObject = (key, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { Body } = yield getObjectService(key, opts, clientOpts);
    const objectBody = yield streamToBuffer(Body);
    return objectBody;
  });
export default getObject;
