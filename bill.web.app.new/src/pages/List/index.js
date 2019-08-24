import * as React from "react";
import {ActivityIndicator, Flex, ListView} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import MonthItem from "@pages/List/MonthItem";
import DayItem from "@pages/List/DayItem";
import {observer} from "mobx-react";
import {action, observable, toJS} from "mobx";
import {billListApi} from "../../services/api";
import Bottom from "./Bottom";
import moment from "moment";
import "./index.less"
import {RouteUtils} from "@utils/RouteUtils";

const VIEW_TYPE = ["MONTH", "BILL"];

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    @observable activityIndicatorState = {
        text: "加载中",
        animating: false,
    };
    @observable isLoading = false;
    @observable totalData = {
        income: "0",
        outgoing: "0",
        surplus: "0",
    };
    toolBarTitle = "";
    queryParams = {};

    //按月份分组
    monthRows = [];
    billRows = [];

    @action
    async loadMonthStatList() {
        try {
            this.activityIndicatorState.animating = true;
            let result = await billListApi.getMonthStatList(this.queryParams);
            let sumResult = await billListApi.getSumStatList(this.queryParams);
            let data = result.data || [];
            let billRows = [];
            data.forEach((item, index) => {
                this.completeMonthField(item);
                billRows.push([]);
            });
            let sumData = sumResult.data && sumResult.data[0] || {};

            this.monthRows = data;
            this.billRows = billRows;
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
            this.totalData = {
                outgoing: sumData.outgoing,
                income: sumData.income,
                surplus: sumData.surplus,
            };
            this.activityIndicatorState.animating = false;
        } catch (e) {
            this.activityIndicatorState.animating = false;
        }
    }

    @action
    async changeExpandState(month, expand = false) {
        try {
            this.activityIndicatorState.animating = true;
            let index = this.monthRows.findIndex(item => item.dateTime === month);
            this.monthRows[index].expand = expand;
            let billList = this.billRows[index];
            if (expand && billList.length === 0) {
                //展开
                let startMonth = month;
                let endMonth = moment(month).add(1, "M").add(-1, "s").format("YYYY-MM-DD HH:mm:ss");
                let params = {
                    ...toJS(this.queryParams),
                    dateTime: [startMonth, endMonth],
                };
                let d = await billListApi.getBillList(params);
                billList = d.data || [];
                this.billRows[index] = this.completeBillListField(billList);
            }
            let data = this.calculateListViewData();
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
            this.activityIndicatorState.animating = false;
        } catch (e) {
            this.activityIndicatorState.animating = false;
        }

    }

    //更新单月数据
    async loadOneMonthData(month) {
        console.log(month);
        try {
            this.activityIndicatorState.animating = true;
            let index = this.monthRows.findIndex(item => item.dateTime === month);

            let startMonth = month;
            let endMonth = moment(month).add(1, "M").add(-1, "s").format("YYYY-MM-DD HH:mm:ss");
            let params = {
                ...this.queryParams,
                dateTime: [startMonth, endMonth],
            };

            //更新月数据
            let monthItem = (await billListApi.getMonthStatList(params)).data[0];
            this.completeMonthField(monthItem);
            monthItem.expand = true;
            this.monthRows[index] = monthItem;

            let billList = (await billListApi.getBillList(params)).data || [];
            this.billRows[index] = this.completeBillListField(billList);
            let data = this.calculateListViewData();
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
            this.activityIndicatorState.animating = false;
        } catch (e) {
            this.activityIndicatorState.animating = false;
        }
    }

    // 补充月记录字段
    completeMonthField(item = {}) {
        let id = item.dateTime;
        item.date = moment(item.dateTime).toDate();
        item.id = id;
        item.viewType = VIEW_TYPE[0];
        item.key = id + Date.now();
        return item;
    }

    // 补充账单字段
    completeBillListField(rows = []) {
        let currDayStr = null;
        rows.forEach(item => {
            //将字符串时间转成Date对象
            item.key = item.id + (item.updateTime || "");
            let dayStr = moment(item.dateTime).format("YYYY-MM-DD");
            if (currDayStr !== dayStr) {
                item.showDate = true;
                currDayStr = dayStr;
            }
            item.viewType = VIEW_TYPE[1];
        });
        return rows;
    }

    //获取数据
    calculateListViewData() {
        let data = [];
        this.monthRows.forEach((item, index) => {
            data.push(item);
            if (item.expand) {
                data.push(...this.billRows[index]);
            }
        });
        return data;
    }
}

@observer
export default class List extends React.Component {
    _appState = new AppState();
    //正在进行编辑的月份
    _onEditDateTimeStr;

    constructor(props, context) {
        super(props, context);
        let queryObject = RouteUtils.getQueryObject(props.location);
        let {name = "流水", ...params} = queryObject;
        this._appState.toolBarTitle = name;
        this._appState.queryParams = params || {};
    }

    componentDidMount() {
        this._appState.loadMonthStatList().then();
    }

    onAddClick = (event) => {
        event.stopPropagation();
        this.props.history.push(this.props.match.path  + "/add-bill");
    };

    onItemClick = (item) => {
        this._onEditDateTimeStr = item.dateTime;
        this._cacheSelectItem = item;
        this.props.history.push(this.props.match.path + "/edit-bill?id=" + item.id);
    };

    onExpandChange = (dateTime, expand) => {
        this._appState.changeExpandState(dateTime, expand).then();
    };

    onBottomChange = (values) => {
        this._appState.queryParams = {
            ...this._appState.queryParams,
            ...values
        };
        this._appState.loadMonthStatList().then();
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        if (rowData.viewType === VIEW_TYPE[0]) {
            let {income, outgoing, date, expand = false, dateTime} = rowData;
            return (
                <MonthItem
                    income={income}
                    outgoing={outgoing}
                    date={date}
                    defaultExpand={expand}
                    onExpandChange={(expand) => {
                        this.onExpandChange(dateTime, expand);
                    }}
                />
            );
        } else {
            return (
                <DayItem
                    data={rowData}
                    showDate={rowData.showDate}
                    onClick={() => {
                        this.onItemClick(rowData);
                    }}
                />
            );
        }
    };

    render() {
        const {totalData, activityIndicatorState} = this._appState;
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ActivityIndicator
                    {...toJS(activityIndicatorState)}
                    toast={true}
                    size={"large"}
                />
                <ToolBar
                    title={this._appState.toolBarTitle}
                    showAdd={true}
                    showSearch={true}
                    onAddClick={this.onAddClick}
                />

                <ListView
                    style={styles.content}
                    ref={(e) => {
                        this._listView = e
                    }}
                    renderHeader={() =>
                        <SlideShow
                            title={"净资产"}
                            money={totalData.surplus}
                            label1={"收入"}
                            value1={totalData.income}
                            label2={"支出"}
                            value2={totalData.outgoing}
                        />
                    }
                    dataSource={toJS(this._appState.listViewDataSource)}
                    renderRow={this.renderItem}
                    initialListSize={15}
                    pageSize={15}
                />
                <Bottom onChange={this.onBottomChange}/>
            </Flex>
        );

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {pathname} = this.props.location;
        let {path} = this.props.match;
        let {pathname: nextPathname} = prevProps.location;
        if (pathname !== nextPathname && pathname === path) {//地址发生变化，且为当前地址，说明是跳转后返回
            let monthDate = this._onEditDateTimeStr || new Date();
            let month = moment(monthDate).format("YYYY-MM-01 00:00:00");
            this._appState.loadOneMonthData(month).then();
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
    }
};