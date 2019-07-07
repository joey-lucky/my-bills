import * as React from "react";
import {ActivityIndicator, Flex, ListView} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import MonthItem from "@pages/List/MonthItem";
import DayItem from "@pages/List/DayItem";
import {observer} from "mobx-react";
import {action, observable, toJS} from "mobx";
import {billListApi} from "../../services/api";
import moment from "moment";
import "./index.less"

const VIEW_TYPE = ["MONTH", "BILL"];

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.id !== row2.id,
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
                    let id = item.dateTime;
                    item.date = moment(item.dateTime).toDate();
                    item.id = id;
                    item.viewType = VIEW_TYPE[0];
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

    asyncChangeExpandState(month, expand = false) {
        this.isLoading = true;
        new Promise(async (resolve, reject) => {
            try {
                let index = this.monthRows.findIndex(item => item.dateTime === month);
                this.monthRows[index].expand = expand;
                let itemBillRows = this.billRows[index];
                if (expand && itemBillRows.length === 0) {
                    //展开
                    let startMonth = month;
                    let endMonth = moment(month).add(1, "M").add(-1, "s").format("YYYY-MM-DD HH:mm:ss");
                    let params = {
                        dateTime: [startMonth, endMonth],
                    };
                    let d = await billListApi.getBillList(params);
                    itemBillRows = d.data || [];
                    let currDayStr = null;
                    itemBillRows.forEach(item => {
                        //将字符串时间转成Date对象
                        item.date = moment(item.dateTime).toDate();
                        let dayStr = moment(item.dateTime).format("YYYY-MM-DD");
                        if (currDayStr !== dayStr) {
                            item.showDate = true;
                            currDayStr = dayStr;
                        }
                        item.viewType = VIEW_TYPE[1];
                    });
                    if (itemBillRows[0]) {
                        itemBillRows[0].showDate = true;
                    }
                    this.billRows[index] = itemBillRows;
                }
                let data = [];
                this.monthRows.forEach((item, index) => {
                    data.push(item);
                    if (item.expand) {
                        data.push(...this.billRows[index]);
                    }
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        }).then(data => {
            this.isLoading = false;
            this.listViewDataSource = this.listViewDataSource.cloneWithRows(data);
        }).catch(reason => {
            this.isLoading = false;
        });


    }
}

@observer
export default class List extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadMonthStatList();
    }

    onAddClick = (event) => {

    };

    @action
    onSelectOnlyOwn = (selected) => {
        // //选中状态改变后，需要重新加载数据
        // this._appState.resetCacheAndPage();
        // this._appState.selectOnlyMe = selected;
        // this._appState.asyncLoadData();
        if (this._listView) {
            this._listView.scrollTo(0, 0);
        }
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
                        this._appState.asyncChangeExpandState(dateTime, expand);
                    }}
                />
            );
        } else {
            let {date, money, billDesc, cardName, billTypeName, showDate} = rowData;
            return (
                <DayItem
                    date={date}
                    money={money}
                    billDesc={billDesc}
                    cardName={cardName}
                    billTypeName={billTypeName}
                    showDate={showDate}
                    onClick={() => {
                        this.onItemClick(rowData);
                    }}
                />
            );
        }
    };

    onItemClick = (item) => {
        let pathname = this.props.location.pathname;
        let parentPath = pathname.replace(/[^/]+$/, "");
        let url = parentPath + "edit-bill?id=" + item.id;
        console.log(url);
        this.props.history.push(url);
    };

    render() {
        console.log("render", toJS(this._appState.listViewDataSource));
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
                    renderHeader={()=>
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
}

const styles = {
    container: {
        width: "100%",
        height: "100%"
    },
    content: {
        width: "100%",
        height: 0,
        flex: 1,
        overflowY: "auto",
        position: "relative"
    }
};