// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportParseBody from '../../../app/service/parse_body';
import ExportTable from '../../../app/service/table';
import ExportTest from '../../../app/service/test';
import ExportTranslateTable from '../../../app/service/translate_table';

declare module 'egg' {
  interface IService {
    parseBody: ExportParseBody;
    table: ExportTable;
    test: ExportTest;
    translateTable: ExportTranslateTable;
  }
}
