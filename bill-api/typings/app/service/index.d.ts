// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSafe from '../../../app/service/safe';
import ExportTable from '../../../app/service/table';
import ExportTranslateTable from '../../../app/service/translateTable';

declare module 'egg' {
  interface IService {
    safe: ExportSafe;
    table: ExportTable;
    translateTable: ExportTranslateTable;
  }
}
