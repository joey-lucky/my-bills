// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSafe from '../../../app/controller/safe';
import ExportTable from '../../../app/controller/table';
import ExportWxappAsset from '../../../app/controller/wxapp/Asset';
import ExportWxappBill from '../../../app/controller/wxapp/Bill';
import ExportWxappCard from '../../../app/controller/wxapp/Card';
import ExportWxappCardType from '../../../app/controller/wxapp/CardType';
import ExportWxappTable from '../../../app/controller/wxapp/Table';

declare module 'egg' {
  interface IController {
    safe: ExportSafe;
    table: ExportTable;
    wxapp: {
      asset: ExportWxappAsset;
      bill: ExportWxappBill;
      card: ExportWxappCard;
      cardType: ExportWxappCardType;
      table: ExportWxappTable;
    }
  }
}
