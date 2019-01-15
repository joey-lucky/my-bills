// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportRequestLogger from '../../../app/middleware/request_logger';
import ExportRequestParser from '../../../app/middleware/request_parser';

declare module 'egg' {
  interface IMiddleware {
    requestLogger: typeof ExportRequestLogger;
    requestParser: typeof ExportRequestParser;
  }
}
