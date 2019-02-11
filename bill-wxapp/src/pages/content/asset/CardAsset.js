import * as React from "react";
import {observable, runInAction, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, Icon, List, ListView, NavBar} from "antd-mobile";
import {cardAsset, tableController} from "@services/api";
import {createForm} from "rc-form";

class AppState {

    @observable totalMoney = 0;
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        cardAsset.list().then((d) => {
            let data = d.data || [];
            let totalMoney = data.reduce((pre, curr) => pre + (curr["totalMoney"] || 0), 0);
            totalMoney = new Number(totalMoney).toFixed(2);
            runInAction(() => {
                this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
                this.totalMoney = totalMoney;
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
        let {totalMoney=0, pic} = rowData;
        let income = totalMoney >= 0;
        let showMoney = income ? " + " + totalMoney : " - " + Math.abs(totalMoney);

        let layout = {color: "black"};
        if (totalMoney < 0) {
            layout = {color: "green"}
        }else if (totalMoney > 0) {
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

                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
                    onLeftClick={() => this.props.history.goBack()}
                    rightContent={<span onClick={this.onAddClick}></span>}
                >资产列表</NavBar>
                <div>
                    {"总资产：" + this._appState.totalMoney}
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
