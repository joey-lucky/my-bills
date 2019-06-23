import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import {Divider} from "@components/Divider";
import {observable, toJS} from "mobx";
import CardList from "./CardList";
import {asset} from "../../services/api";
import {observer} from "mobx-react";

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
                    title={"账户"}
                    showAdd={true}
                    onAddClick={this.onAddClick}
                />
                <Flex
                    style={styles.content}
                    justify={"start"}
                    align={"start"}
                    direction={"column"}
                >
                    <SlideShow
                        title={"净资产"}
                        money={this._appState.total.total}
                        label1={"资产"}
                        value1={this._appState.total.asset}
                        label2={"负债"}
                        value2={this._appState.total.credit}
                    />
                    {
                        toJS(this._appState.data).map((item, index) =>
                            <React.Fragment key={item.cardTypeName}>
                                <CardList
                                    cardTypeName={item.cardTypeName}
                                    totalBalance={item.balance}
                                    cardData={item.children}
                                />
                                {
                                    index !== this._appState.data.length &&
                                    <Divider
                                        direction={"row"}
                                        size={"0.1rem"}
                                        colorType={"light"}
                                    />
                                }
                            </React.Fragment>
                        )

                    }

                </Flex>
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