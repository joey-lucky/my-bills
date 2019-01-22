// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorHandler from '../../../app/middleware/errorHandler';
import ExportParamParser from '../../../app/middleware/paramParser';
import ExportRequestLogger from '../../../app/middleware/requestLogger';
import ExportResultParser from '../../../app/middleware/resultParser';
import ExportTokenVerify from '../../../app/middleware/tokenVerify';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
    paramParser: typeof ExportParamParser;
    requestLogger: typeof ExportRequestLogger;
    resultParser: typeof ExportResultParser;
    tokenVerify: typeof ExportTokenVerify;
  }
}
