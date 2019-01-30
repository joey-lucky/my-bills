// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSafe from '../../../app/controller/safe';
import ExportTable from '../../../app/controller/table';
import ExportWxappBillAdd from '../../../app/controller/wxapp/BillAdd';
import ExportWxappBillList from '../../../app/controller/wxapp/BillList';
import ExportWxappTable from '../../../app/controller/wxapp/Table';

declare module 'egg' {
  interface IController {
    safe: ExportSafe;
    table: ExportTable;
    wxapp: {
      billAdd: ExportWxappBillAdd;
      billList: ExportWxappBillList;
      table: ExportWxappTable;
    }
  }
}
