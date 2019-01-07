import * as React from "react";
import Ajax from "@utils/Ajax";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, Icon, List, ListView, NavBar} from "antd-mobile";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([{},{},{}]);
        Ajax.apiPost("/table/list", {tableName: "bd_bill"})
            .then((data) => {

            });
    }
}

@observer
export default class HomePage extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick=()=>{

    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <List.Item
                arrow="horizontal"
                multipleLine
                onClick={() => {
                }}
            >
                {/*{rowData["bill_type_name"] + " " + rowData["money"]}*/}
                特殊账单
                <List.Item.Brief>
                    {rowData["card_name"] + " " + rowData["user_name"]}<br/>
                    {rowData["bill_desc"]}<br/>
                </List.Item.Brief>
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
                    icon={<Icon type="left"/>}
                    onLeftClick={() => this.props.history.goBack()}
                    rightContent={<span onClick={this.onAddClick}>新增</span>}
                >账单管理</NavBar>

                <ListView
                    style={{width: "100%", flex: 1}}
                    dataSource={toJS(this._appState.listViewDataSource)}
                    renderRow={this.renderItem}
                    renderSeparator={(sectionID, rowID) => (
                        <div
                            key={rowID}
                            style={{
                                backgroundColor: "#F5F5F9",
                                height: 8,
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
