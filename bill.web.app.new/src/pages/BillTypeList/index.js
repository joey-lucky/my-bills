import * as React from "react";
import {ActivityIndicator, Flex, ListView} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import {observer} from "mobx-react";
import {observable, toJS} from "mobx";
import {billTypeListApi} from "../../services/api";
import "./index.less"
import colors from "@res/colors";
import BillTypeItem from "@pages/BillTypeList/BillTypeItem";

const VIEW_TYPE = ["header", "item"];

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    @observable activityIndicatorState = {
        text: "加载中",
        animating: false,
    };

    async loadData() {
        try {
            this.activityIndicatorState.animating = true;
            let d = await billTypeListApi.getList({});
            let data = d.data || [];
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
            this.activityIndicatorState.animating = false;
        } catch (e) {
            this.activityIndicatorState.animating = false;
        }
    }
}

@observer
export default class BillTypeList extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.loadData().then();
    }

    onAddClick = (event) => {
        event.stopPropagation();
        let path = this.props.match.path + "/add-bill";
        this.props.history.push(path);
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        return (
            <BillTypeItem
                value={rowData}
                onClick={(event)=>{
                    event.stopPropagation();
                    this.onItemClick(rowData)
                }}
            />
        );
    };

    onItemClick = (item) => {
        this._cacheSelectItem = item;
        let url = this.props.match.path + "/edit-bill?id=" + item.id;
        this.props.history.push(url);
    };

    onEndReached = () => {
        let {pageInfo} = this._appState;
        if (pageInfo.pageCount > pageInfo.pageIndex) {
            pageInfo.pageIndex++;
            this._appState.loadData().then();
        }
    };

    render() {
        let {activityIndicatorState,toolBarName} = this._appState;
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ActivityIndicator
                    {...activityIndicatorState}
                    toast={true}
                    size={"large"}
                />
                <ToolBar
                    title={"账单类型管理"}
                    showAdd={false}
                    showSearch={false}
                />
                <ListView
                    style={styles.content}
                    dataSource={toJS(this._appState.listViewDataSource)}
                    renderRow={this.renderItem}
                    initialListSize={15}
                    pageSize={15}
                />
            </Flex>
        );

    }

    componentDidUpdate(prevProps, prevState) {
        let {pathname} = this.props.location;
        let {path} = this.props.match;
        let {pathname: nextPathname} = prevProps.location;
        if (pathname !== nextPathname && pathname === path) {//地址发生变化，且为当前地址，说明是跳转后返回
            this._appState.loadData().then();
        }
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "white",
        top: 0,
        left: 0,
    },
    content: {
        width: "100%",
        height: 0,
        flex: 1,
        overflowY: "auto",
        position: "relative"
    },
    divider: {
        width: "100%",
        height: 12,
        color: colors.divider
    },
};