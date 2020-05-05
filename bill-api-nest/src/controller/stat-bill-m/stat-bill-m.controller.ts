import {Controller, Get, Inject, Query} from "@nestjs/common";
import {StatBillMService} from "./stat-bill-m.service";
import {BaseRestController} from "../base-rest.controller";

@Controller("stat-bill-m")
export class StatBillMController  extends BaseRestController{
    @Inject()
    private readonly service: StatBillMService;

    getService(): any {
        return this.service;
    }

    //获取账单月统计列表
    @Get("get-group-by-month-list")
    public async getGroupByMonthList(@Query() queryParams:any) {
        const data = await this.service.getGroupByMonthList(queryParams);
        return this.responseService.success(data, "");
    }

    @Get("get-stat-data")
    public async getStatData(@Query() queryParams:any) {
        const data = await this.service.getSumData(queryParams);
        return this.responseService.success(data, "");
    }
}