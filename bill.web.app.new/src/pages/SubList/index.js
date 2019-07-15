import * as React from "react";
import {ActivityIndicator, Flex, ListView} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import DayItem from "./DayItem";
import {observer} from "mobx-react";
import {observable, toJS} from "mobx";
import {subBillListApi} from "../../services/api";
import moment from "moment";
import "./index.less"
import {RouteUtils} from "@utils/RouteUtils";
import colors from "@res/colors";
import BillItem from "@pages/SubList/BillItem";

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

    params = {};
    pageInfo = {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 1
    };

    //按月份分组
    billRows = [];

    async loadData() {
        try {
            this.activityIndicatorState.animating = true;
            let params = {
                ...this.params,
                pageInfo: JSON.stringify(this.pageInfo)
            };
            let d = await subBillListApi.getBillPageData(params);
            let data = d.data || [];
            let allBillRow = [...this.billRows, ...data];
            let result = [];
            let currDay = null;
            let isFirst = true;
            for (let bill of allBillRow) {
                let dateMoment = moment(bill.dateTime);
                let day = dateMoment.format("YYYYMMDD");
                if (currDay !== day) {
                    console.log(day);
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
        let {name, ...params} = RouteUtils.getQueryObject(props.location);
        this._appState.toolBarName = name;
        this._appState.params = params;
    }

    componentDidMount() {
        this._appState.loadData().then();
    }

    onAddClick = (event) => {
        event.stopPropagation();
        let path = this.props.match.path + "/add-bill";
        this.props.history.push(path);
    };

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
        let pathname = this.props.location.pathname;
        let url = pathname + "/edit-bill?id=" + item.id;
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
                    title={toolBarName}
                    showAdd={false}
                    showSearch={false}
                />
                <ListView
                    style={styles.content}
                    ref={(e) => {
                        this._listView = e
                    }}
                    renderHeader={() =>
                        <SlideShow
                            title={"净资产"}
                            money={"10000"}
                            label1={"资产"}
                            value1={"20000"}
                            label2={"负债"}
                            value2={"10000"}
                        />
                    }
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