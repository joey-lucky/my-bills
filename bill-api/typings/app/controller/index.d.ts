// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportTable from '../../../app/controller/table';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    table: ExportTable;
  }
}
