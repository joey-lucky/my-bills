import * as React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, Icon, List, ListView, NavBar} from "antd-mobile";
import {billList} from "@services/api";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        billList.list().then((d) => {
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
        let path = match.path.replace(/(.*)(\/[a-z-]+)/, '$1/bill-add');
        this.props.history.push(path);
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        let isConsume = rowData["money"] > 0;
        let money = isConsume ? " - " + rowData["money"] : " + " + Math.abs(rowData["money"]);
        let layout = isConsume ? {color:"black"} : {color: "red"};
        return (
            <List.Item
                onClick={() => {
                }}
                thumb="http://www.hjoey.com/file/huangqiuyu.jpg"
                extra={<h3 style={layout}>{money}</h3>}
                wrap={true}
            >
                {
                    rowData["bill_type_name"] + "  ¥"
                }
                <List.Item.Brief>{rowData["date_time"]}</List.Item.Brief>

            </List.Item>
        );
    };

    render() {
        return (
            <Flex
                style={{height: "100%", backgroundColor: "rgba(0,0,0,0.1)"}}
                direction={"column"}
                align={"center"}>
                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
                    onLeftClick={() => this.props.history.goBack()}
                    rightContent={<span onClick={this.onAddClick}>新增</span>}
                >账单列表</NavBar>

                <ListView
                    style={{width: "100%", flex: 1}}
                    dataSource={toJS(this._appState.listViewDataSource)}
                    renderRow={this.renderItem}
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
            </Flex>
        )
    }
}
