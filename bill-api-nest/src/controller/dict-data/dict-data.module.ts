import {Module} from '@nestjs/common';
import {DictDataController} from "./dict-data.controller";
import {DictDataService} from "./dict-data.service";

@Module({
  imports: [],
  controllers: [DictDataController],
  providers:[DictDataService]
})
export class DictDataModule {}
