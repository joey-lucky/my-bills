import * as React from "react";
import {ActivityIndicator, Flex, ListView, SearchBar} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import DayItem from "./DayItem";
import {observer} from "mobx-react";
import {observable, toJS} from "mobx";
import moment from "moment";
import "./index.less"
import {RouteUtils} from "@utils/RouteUtils";
import colors from "@res/colors";
import BillItem from "@pages/SubList/BillItem";
import {billAPI} from "../../services";

const VIEW_TYPE = ["header", "item"];

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    @observable activityIndicatorState = {
        text: "加载中",
        animating: false,
    };
    @observable toolBarName = "账单列表";

    params = {
        billDesc:""
    };
    pageInfo = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 1
    };

    billRows = [];

    async loadData() {
        try {
            this.activityIndicatorState.animating = true;
            let params = {
                ...this.params,
                pageInfo: JSON.stringify(this.pageInfo)
            };
            let d = await billAPI.index(params);
            let data = d.data || [];
            this.billRows = [...this.billRows, ...data];
            let result = [];
            let currDay = null;
            let isFirst = true;
            for (let bill of  this.billRows) {
                let dateMoment = moment(bill.dateTime);
                let day = dateMoment.format("YYYYMMDD");
                if (currDay !== day) {
                    if (result.length > 0) {
                        result[result.length - 1].showDivider = false;
                    }
                    result.push({
                        date: dateMoment.toDate(),
                        viewType: VIEW_TYPE[0],
                        showDivider: !isFirst
                    });
                    isFirst = false;
                    currDay = day;
                }
                bill.showDivider = true;
                bill.viewType = VIEW_TYPE[1];
                result.push(bill);
            }
            if (result.length > 0) {
                result[result.length - 1].showDivider = false;
            }
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(result);
            this.pageInfo = d.pageInfo;
            this.activityIndicatorState.animating = false;
        } catch (e) {
            this.activityIndicatorState.animating = false;
        }
    }
}

@observer
export default class SubList extends React.Component {
    _appState = new AppState();
    _cacheSelectItem;

    constructor(props, context) {
        super(props, context);
        let {name="账单列表", ...params} = RouteUtils.getQueryObject(props.location);
        this._appState.toolBarName = name;
        if (params.dateTime) {
            params["dateTime>="] = params.dateTime[0];
            params["dateTime<="] = params.dateTime[1];
            delete params.dateTime;
        }
        this._appState.params = params;
    }

    componentDidMount() {
        this._appState.loadData().then();
    }

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        if (rowData.viewType === VIEW_TYPE[1]) {
            return (
                <BillItem
                    data={rowData}
                    showDivider={rowData.showDivider}
                    onClick={(event)=>{
                        event.stopPropagation();
                        this.onItemClick(rowData)
                    }}
                />
            );
        } else {
            return (
                <React.Fragment>
                    {
                        rowData.showDivider &&
                        <div style={styles.divider}/>
                    }
                    <DayItem
                        date={rowData.date}
                    />
                </React.Fragment>
            );
        }
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

    onSearch = (value="") => {
        this._appState.params.billDesc = value;
        this._appState.pageInfo.pageIndex = 1;
        this._appState.billRows = [];
        this._appState.loadData().then();
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
                    title={toolBarName}
                    showAdd={false}
                    showSearch={false}
                />
                <SearchBar
                    style={{width:"100%"}}
                    placeholder="请输入搜索内容"
                    onSubmit={this.onSearch}
                    onClear={this.onSearch}
                />
                <ListView
                    style={styles.content}
                    ref={(e) => {
                        this._listView = e
                    }}
                    dataSource={toJS(this._appState.listViewDataSource)}
                    renderRow={this.renderItem}
                    initialListSize={15}
                    onEndReached={this.onEndReached}
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