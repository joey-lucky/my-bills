import * as React from "react";
import {Flex, Tabs} from "antd-mobile";
import IncomeDetail from "./IncomeDetail";
import ConsumeDetail from "./ConsumeDetail";
import TopBar from "../TopBar";
import moment from "moment";
import {statApi} from "@services/api";

export default class MonthStatDetail extends React.Component {
    static getDerivedStateFromProps(props, preState) {
        let datetime = props.location.state.datetime || moment().format("YYYY-MM-DD HH:mm:ss");
        let title = moment(datetime).format("YYYY年MM月") + "明细";
        return {
            datetime: datetime,
            title: title,
        }
    }

    _tabs = [
        {title: '支出', sub: '1'},
        {title: '收入', sub: '2'},
    ];

    constructor(props, context) {
        super(props, context);
        this.state = {
            datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            incomeValue:{},
            consumeValue:{},
            title: "",
            index: 1,
        }
    }

    onTabClick = (tab, index) => {
        this.setState({
            index: index
        });
    };

    componentDidMount() {
        this.asyncLoadData();
    }

    asyncLoadData() {
        function parseToTotalData(data = []) {
            let totalMoney = 0;
            let groupByBillTypeName = {};
            for (let item of data) {
                let billTypeName = item["bill_type_name"];
                let money = Number(Math.abs(Number(item.money)).toFixed(0));
                if (!groupByBillTypeName[billTypeName]) {
                    groupByBillTypeName[billTypeName] = {...item, money: 0};
                }
                groupByBillTypeName[billTypeName].money += money;
                totalMoney += money;
            }
            //计算百分比
            let result = [];
            Object.values(groupByBillTypeName).forEach((item) => {
                let money = item.money;
                let percent = Number(money / totalMoney).toFixed(2);
                if (percent >= 0.01) {
                    item.percent = percent;
                    result.push({
                        "percent":Number(percent),
                        "bill_type_name":item["bill_type_name"],
                        "money":item["money"],
                    });
                }
            });
            return result;
        }

        statApi.getMonthStatDetail({datetime: this.state.datetime}).then((d) => {
            let data = d.data || [];
            let incomeData = data.filter(item => Number(item.money) >= 0);
            let consumeData = data.filter(item => Number(item.money) < 0);
            let incomeTotalData = parseToTotalData(incomeData);
            let consumeTotalData = parseToTotalData(consumeData);
            this.setState({
                incomeValue:{
                    total:incomeTotalData
                },
                consumeValue:{
                    total:consumeTotalData
                },
            })
        });
    }

    render() {
        return (
            <Flex
                style={{width: "100%", height: "100%"}}
                direction={"column"}>
                <TopBar title={this.state.title}/>
                <Tabs
                    tabs={this._tabs}
                    page={this.state.index}
                    initialPage={0}
                    tabBarPosition={"top"}
                    renderTab={tab => <span>{tab.title}</span>}
                    onTabClick={this.onTabClick}
                >
                    <ConsumeDetail value={this.state.consumeValue}/>
                    <IncomeDetail value={this.state.incomeValue}/>
                </Tabs>
            </Flex>

        );
    }
}