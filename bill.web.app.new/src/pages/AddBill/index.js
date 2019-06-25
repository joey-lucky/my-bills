import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import {observable} from "mobx";
import {asset} from "../../services/api";
import {observer} from "mobx-react";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import Blank from "@components/Blank";
import TopList from "./TopList";

class AppState {
    @observable data = [];
    @observable total = {
        total: "0",
        asset: "0",
        credit: "0",//信用卡
    };

    asyncLoadData() {
        asset.groupByTypeList({}).then(d => {
            let data= d.data || [];
            let total = 0;
            let asset = 0;
            let credit = 0;
            for (let item of data) {
                total += item.balance;
                if (item.balance >= 0) {
                    asset += item.balance;
                }else {
                    credit+=Math.abs(item.balance);
                }
            }
            this.total = {
                total:total.toFixed(0),
                asset:asset.toFixed(0),
                credit:credit.toFixed(0)
            };
            this.data = data;
        });
    }
}

@observer
export default class AddBill extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = (event) => {
        event.stopPropagation();
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ToolBar
                    title={"记一笔"}
                    rightExtra={(
                        <Blank
                            level={1}
                            direction={"row"}
                            onClick={this.props.onAddClick}
                        >
                            <Text
                                color={"#F6A724"}
                                type={"appBar"}>

                                <FontIcon
                                    unicode={icons.confirm}/>
                            </Text>
                            <Text
                                text={"保存"}
                                color={"#F6A724"}
                                type={"title"}/>
                        </Blank>
                    )}
                />
                <TopList
                    data={["模板","支出","收入","转账","还款","借贷","代付","报销","退款"]}
                    onItemClick={()=>{}}
                />
            </Flex>
        );

    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    content: {
        height: 0,
        width: "100%",
        flex: 1,
        overflowY: "auto"
    }
};