// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/test';
import ExportTest1 from '../../../app/service/test1';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    test1: ExportTest1;
  }
}
