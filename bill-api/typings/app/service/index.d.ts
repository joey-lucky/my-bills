// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSafe from '../../../app/service/safe';
import ExportTable from '../../../app/service/Table';

declare module 'egg' {
  interface IService {
    safe: ExportSafe;
    table: ExportTable;
  }
}
