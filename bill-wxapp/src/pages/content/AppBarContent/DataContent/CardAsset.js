import * as React from "react";
import {observable, runInAction, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, List, ListView} from "antd-mobile";
import {cardAsset} from "@services/api";
import {createForm} from "rc-form";

class AppState {

    @observable balance = 0;
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        cardAsset.list().then((d) => {
            let data = d.data || [];
            let balance = data.reduce((pre, curr) => pre + (Number(curr["balance"]) || 0), 0);
            console.log(balance);
            balance = Number(balance).toFixed(2);
            runInAction(() => {
                this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
                this.balance = balance;
            });
        });
    }
}

@createForm()
@observer
export default class CardAsset extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {

    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        let {balance=0, pic} = rowData;
        let income = balance >= 0;
        let showMoney = income ? " + " + balance : " - " + Math.abs(balance);

        let layout = {color: "black"};
        if (balance < 0) {
            layout = {color: "green"}
        }else if (balance > 0) {
            layout = {color: "red"}
        }
        return (
            <List.Item
                onClick={() => {
                }}
                thumb={pic}
                extra={<h3 style={layout}>{showMoney}</h3>}
                wrap={true}
            >
                {
                    rowData["name"]
                }
                <List.Item.Brief style={{fontSize: "0.5rem"}}>
                    {rowData["user_name"]}
                </List.Item.Brief>
            </List.Item>
        );
    };

    render() {
        return (
            <Flex
                style={{height: "100%", width: "100%"}}
                direction={"column"}
                align={"center"}>
                <div>
                    {"总资产：" + this._appState.balance}
                </div>
                <Flex.Item style={{width: "100%"}}>
                    <ListView
                        style={{width: "100%", height: "100%"}}
                        dataSource={toJS(this._appState.listViewDataSource)}
                        renderRow={this.renderItem}
                        initialListSize={20}
                        renderSeparator={(sectionID, rowID) => (
                            <div
                                key={rowID}
                                style={{
                                    backgroundColor: "#F5F5F9",
                                    height: 1,
                                    borderTop: "1px solid #ECECED",
                                    borderBottom: "1px solid #ECECED"
                                }}
                            />
                        )}
                    />
                </Flex.Item>
            </Flex>
        );
    }
}
