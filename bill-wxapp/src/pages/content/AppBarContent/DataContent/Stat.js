import * as React from "react";
import {Card, Flex, Icon} from "antd-mobile";
import {globalStyles} from "@global";
import {observer} from "mobx-react";
import {observable, toJS} from "mobx";
import {statApi} from "@services/api";
import {withRouter} from "react-router-dom";
import moment from "moment";

class AppState {
    @observable data = [];

    asyncLoadData() {
        statApi.getStatGroupByMonth().then((d) => {
            let data = d.data || [];
            let groupByMonth = {};
            data.forEach((item) => {
                let datetime = item.datetime;
                let money = item.money;
                if (!groupByMonth[datetime]) {
                    groupByMonth[datetime] = {
                        datetime: datetime,
                        yearMonthStr:moment(datetime).format("YYYY年MM月")
                    };
                }
                let obj = groupByMonth[datetime];
                if (Number.parseInt(money) >= 0) {
                    obj.income = money;
                } else {
                    obj.consume = Math.abs(Number.parseInt(money));
                }
            });
            this.data = Object.values(groupByMonth);
        });
    }

}

@withRouter
@observer
export default class Stat extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onDetailClick = (item) => {
        this.props.history.push("/content/nav-bar/month-stat-detail",item);
    };

    render() {
        let data = toJS(this._appState.data);
        return (
            <Flex
                style={globalStyles.container}
                direction={"column"}
                align={"center"}>
                {
                    data.map((item) =>
                        <Card
                            key={item.month}
                            style={{width: "95%",marginTop:"1rem"}}>
                            <Card.Header title={item.yearMonthStr}/>
                            <Card.Body >
                                <Flex direction={"row"} style={{margin:"1rem"}}>
                                    <Flex.Item>
                                        <Flex direction={"column"}>
                                            <h5>{"总支出"}</h5>
                                            <h2>{item.consume}</h2>
                                        </Flex>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <Flex direction={"column"}>
                                            <h5>{"总收入"}</h5>
                                            <h2>{item.income}</h2>
                                        </Flex>
                                    </Flex.Item>
                                </Flex>
                            </Card.Body>
                            <Card.Footer extra={
                                <Flex
                                    direction={"row"}
                                    align={"center"}
                                    justify={"end"}
                                    onClick={()=>this.onDetailClick(item)}>
                                    <a href="javascript:">查看详情</a>
                                    <Icon type={"right"}/>
                                </Flex>
                            }/>
                        </Card>
                    )
                }
            </Flex>
        )
    }
}
