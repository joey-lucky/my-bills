import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import {Divider} from "@components/Divider";
import {observable, toJS} from "mobx";
import CardList from "./CardList";
import {assetApi} from "@services/api";
import {observer} from "mobx-react";
import {cardAPI} from "@services/index";
import {strip, round} from "number-precision";

class AppState {
    @observable data = [];
    @observable total = {
        total: "0",
        asset: "0",
        credit: "0",//信用卡
    };

   async loadData() {
       let d =  await cardAPI.index();
       let data = d.data || [];
       let groupByType = {};
       let balanceByType = {};
       let total ={
           total: 0,
           asset: 0,
           credit: 0
       }
       for (let item of data) {
           let cardTypeName = item.cardTypeName;
           if (!groupByType[cardTypeName]) {
               groupByType[cardTypeName] = [];
               balanceByType[cardTypeName] = 0;
           }
           groupByType[cardTypeName].push(item);
           balanceByType[cardTypeName] += item.balance;
           if (item.balance >= 0) {
               total.asset += item.balance;
           } else {
               total.credit += item.balance;
           }
       }
       total.asset = strip(total.asset)
       total.credit = strip(total.credit)
       total.total = strip(total.asset + total.credit);
       this.total = total;
       let groupData = [];
       for (let key of Object.keys(groupByType)) {
           let value = groupByType[key];
           groupData.push({
              ...value[0],
               children:value
           });
       }
       this.data = groupData;
    }
}

@observer
export default class Assert extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.loadData();
    }

    onAddClick = (event) => {
        event.stopPropagation();
    };

    onItemClick = (item, index) => {
        let name = item.userName + "  ·  " + item.name;
        let path = this.props.match.path;
        let cardId = item.id;
        this.props.history.push(`${path}/sub-list?name=${name}&cardId=${cardId}`);
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
                                    onItemCLick={(item) => {
                                        this.onItemClick(item, index);
                                    }}
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