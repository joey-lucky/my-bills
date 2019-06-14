import * as React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, List, ListView} from "antd-mobile";
import {tableController} from "@services/api";
import AddIcon from "@components/AddIcon";
import {withRouter} from "react-router-dom";
import {globalStyles} from "@global";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        tableController.list("bc_card_type").then((d) => {
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(d.data);
        });
    }
}

@withRouter
@observer
export default class CardTypeList extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {
        this.props.history.push("/content/nav-bar/card-type-add",{});
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <List.Item
                multipleLine={false}
            >
                {rowData["name"]}
            </List.Item>
        );
    };

    render() {
        return (
            <Flex
                style={globalStyles.container}
                direction={"column"}
                align={"center"}>
                <ListView
                    style={{width: "100%", flex: 1}}
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
                <AddIcon onAddClick={this.onAddClick}/>
            </Flex>
        )
    }
}
