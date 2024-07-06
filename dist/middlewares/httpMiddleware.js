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
Object.defineProperty(exports, '__esModule', { value: true });
const http_json_body_parser_1 = require('@middy/http-json-body-parser');
const http_event_normalizer_1 = require('@middy/http-event-normalizer');
const http_error_handler_1 = require('@middy/http-error-handler');
const do_not_wait_for_empty_event_loop_1 = require('@middy/do-not-wait-for-empty-event-loop');
const http_header_normalizer_1 = require('@middy/http-header-normalizer');
const httpResponseMiddleware_1 = require('./httpResponseMiddleware');
const httpMiddleware = () => {
  const middlewarePackages = [
    (0, do_not_wait_for_empty_event_loop_1.default)(),
    (0, http_event_normalizer_1.default)(),
    (0, http_error_handler_1.default)(),
    (0, http_header_normalizer_1.default)(),
    (0, http_json_body_parser_1.default)(),
    (0, httpResponseMiddleware_1.default)(),
  ];
  return {
    before: handler =>
      __awaiter(void 0, void 0, void 0, function* () {
        for (const middleware of middlewarePackages) {
          if (middleware.before) {
            yield middleware.before(handler);
          }
        }
      }),
    after: handler =>
      __awaiter(void 0, void 0, void 0, function* () {
        for (const middleware of middlewarePackages) {
          if (middleware.after) {
            yield middleware.after(handler);
          }
        }
      }),
    onError: handler =>
      __awaiter(void 0, void 0, void 0, function* () {
        for (const middleware of middlewarePackages) {
          if (middleware.onError) {
            yield middleware.onError(handler);
          }
        }
      }),
  };
};
exports.default = httpMiddleware;
