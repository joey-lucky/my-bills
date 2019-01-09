// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSafe from '../../../app/controller/safe';
import ExportTable from '../../../app/controller/table';

declare module 'egg' {
  interface IController {
    safe: ExportSafe;
    table: ExportTable;
  }
}
