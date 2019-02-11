import * as React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, Icon, List, ListView, NavBar} from "antd-mobile";
import {billApi} from "@services/api";
import {publicPath} from "@global";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        billApi.list().then((d) => {
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(d.data);
        });
    }
}

@observer
export default class BillList extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {
        let {match} = this.props;
        let id = undefined;
        let path = match.path.replace(/(.*)(\/[a-z-]+)/, '$1/bill-add/' + id);
        this.props.history.push(path);
    };

    onItemClick = (rowData) => {
        let {match} = this.props;
        let path = match.path.replace(/(.*)(\/[a-z-]+)/, '$1/bill-add/' + rowData["id"]);
        this.props.history.push(path);
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        let pic = rowData["pic"];
        let money = rowData["money"];

        let income = money > 0;
        let showMoney = income ? " + " + money : " - " + Math.abs(money);
        let layout = income ? {color: "red"} : {color: "black"};
        return (
            <List.Item
                onClick={() => {
                    this.onItemClick(rowData);
                }}
                thumb={pic}
                extra={<h3 style={layout}>{showMoney}</h3>}
                wrap={true}
            >
                {
                    rowData["bill_desc"]
                }
                <List.Item.Brief style={{fontSize: "0.5rem"}}>
                    {rowData["bill_type_name"]}
                </List.Item.Brief>
                <List.Item.Brief style={{fontSize: "0.5rem"}}>
                    {rowData["date_time"]}
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
                    onLeftClick={() => window.location.href = publicPath + "/login/"}
                    rightContent={<span onClick={this.onAddClick}>新增</span>}
                >账单列表</NavBar>

                <Flex.Item style={{width: "100%"}}>
                    <ListView
                        style={{width: "100%", height: "100%"}}
                        dataSource={toJS(this._appState.listViewDataSource)}
                        renderRow={this.renderItem}
                        initialListSize={15}
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
        )
    }
}
