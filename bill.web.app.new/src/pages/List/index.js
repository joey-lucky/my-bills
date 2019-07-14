import * as React from "react";
import {ActivityIndicator, Flex, ListView} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import MonthItem from "@pages/List/MonthItem";
import DayItem from "@pages/List/DayItem";
import {observer} from "mobx-react";
import {action, observable, runInAction, toJS} from "mobx";
import {billListApi} from "../../services/api";
import moment from "moment";
import "./index.less"

const VIEW_TYPE = ["MONTH", "BILL"];

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    @observable isLoading = false;

    //按月份分组
    monthRows = [];
    billRows = [];


    asyncLoadMonthStatList() {
        this.isLoading = true;
        this.listViewDataSource = this.listViewDataSource.cloneWithRows([]);
        billListApi.getMonthStatList()
            .then(d => {
                let data = d.data || [];
                let billRows = [];
                data.forEach((item, index) => {
                    this.completeMonthField(item);
                    billRows.push([]);
                });
                this.monthRows = data;
                this.billRows = billRows;
                this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
            });
    }

    asyncUpdateMonthData(month) {
        this.isLoading = true;
        this.updateMonthData(month).then(data => {
            this.isLoading = false;
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
        }).catch(reason => {
            this.isLoading = false;
        });
    }

    @action
    asyncChangeExpandState(month, expand = false) {
        this.isLoading = true;
        this.changeExpandState(month, expand)
            .then(data => {
                runInAction(() => {
                    this.isLoading = false;
                    this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
                });
            }).catch(reason => {
            this.isLoading = false;
        });
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

    async updateMonthData(month) {
        let index = this.monthRows.findIndex(item => item.dateTime === month);

        let startMonth = month;
        let endMonth = moment(month).add(1, "M").add(-1, "s").format("YYYY-MM-DD HH:mm:ss");
        let params = {
            dateTime: [startMonth, endMonth],
        };

        //更新月数据
        let monthItem = (await billListApi.getMonthStatList(params)).data[0];
        this.completeMonthField(monthItem);
        monthItem.expand = true;
        this.monthRows[index] = monthItem;

        let billList = (await billListApi.getBillList(params)).data || [];
        this.billRows[index] = this.completeBillListField(billList);
        return this.calculateListViewData();
    }

    async changeExpandState(month, expand = false) {
        let index = this.monthRows.findIndex(item => item.dateTime === month);
        this.monthRows[index].expand = expand;
        let billList = this.billRows[index];
        if (expand && billList.length === 0) {
            //展开
            let startMonth = month;
            let endMonth = moment(month).add(1, "M").add(-1, "s").format("YYYY-MM-DD HH:mm:ss");
            let params = {
                dateTime: [startMonth, endMonth],
            };
            let d = await billListApi.getBillList(params);
            billList = d.data || [];
            this.billRows[index] = this.completeBillListField(billList);
        }
        return this.calculateListViewData();
    }
}

@observer
export default class List extends React.Component {
    _appState = new AppState();
    _cacheSelectItem;

    componentDidMount() {
        this._appState.asyncLoadMonthStatList();
    }

    onAddClick = (event) => {
        event.stopPropagation();
        let path = this.props.match.path + "/add-bill";
        this.props.history.push(path);
    };

    // @action
    // onSelectOnlyOwn = (selected) => {
    //     // //选中状态改变后，需要重新加载数据
    //     this._appState.resetCacheAndPage();
    //     this._appState.selectOnlyMe = selected;
    //     this._appState.asyncLoadData();
    //     if (this._listView) {
    //         this._listView.scrollTo(0, 0);
    //     }
    // };

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
                        this._appState.asyncChangeExpandState(dateTime, expand);
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

    onItemClick = (item) => {
        this._cacheSelectItem = item;
        let pathname = this.props.location.pathname;
        let url = pathname + "/edit-bill?id=" + item.id;
        this.props.history.push(url);
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ActivityIndicator
                    text={"加载中..."}
                    animating={this._appState.isLoading}
                    toast={true}
                    size={"large"}
                />
                <ToolBar
                    title={"流水"}
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
            let monthDate = this._cacheSelectItem && this._cacheSelectItem.date || new Date();
            let month = moment(monthDate).format("YYYY-MM-01 00:00:00");
            this._appState.asyncUpdateMonthData(month)
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