import * as React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, Icon, List, ListView, NavBar} from "antd-mobile";
import {cardApi} from "@services/api";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        cardApi.list().then((d) => {
            let data = d.data || [];
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
        });
    }
}

@observer
export default class CardList extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {
        let {match} = this.props;
        let path = match.path.replace(/(.*)(\/[a-z-]+)/, '$1/card-add');
        this.props.history.push(path);
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <List.Item
                arrow="horizontal"
                multipleLine={false}
                extra={rowData["user_name"]}
            >
                {rowData["name"] }
            </List.Item>
        );
    };

    render() {
        return (
            <Flex
                style={{height: "100%"}}
                direction={"column"}
                align={"center"}>
                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
                    rightContent={<span onClick={this.onAddClick}>新增</span>}
                >{"银行卡"}</NavBar>
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
        )
    }
}
