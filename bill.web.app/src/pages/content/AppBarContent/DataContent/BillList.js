import * as React from "react";
import {action, observable, runInAction, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, List, ListView, Picker, Tag, WhiteSpace, WingBlank} from "antd-mobile";
import {StickyContainer} from "react-sticky";
import { billApi} from "@services/api";
import {globalStyles} from "@global";
import * as PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import AddIcon from "@components/AddIcon";

class AppState {
    @observable listViewDataSource = new ListView.DataSource({
        getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
        getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    @observable isLoading = false;
    @observable selectOnlyMe = false;
    @observable pageInfo = {
        pageSize: 15,
        pageIndex: 1,
    };


    userInfo = {};

    cacheData = {
        dataBlobs: {},
        rowIDs: [],
        sectionIDs: [],
        timeDescList: []
    };

    asyncLoadData() {
        this.isLoading = true;
        let params = {
            pageInfo: toJS(this.pageInfo)
        };
        if (this.selectOnlyMe) {
            params["user_id"] = this.userInfo.id;
        }
        billApi.billList.getBillPageData(params).then((d) => {
            let data = d.data || [];
            let pageInfo = d.pageInfo || {};
            let {dataBlobs, rowIDs, sectionIDs, timeDescList} = this.cacheData;
            let groupByTimeDesc = this.groupByTimeDesc(data);
            Object.keys(groupByTimeDesc).forEach((timeDesc, i) => {
                let index = timeDescList.indexOf(timeDesc);
                if (index === -1) {
                    let sectionId = "section_" + timeDesc;
                    timeDescList.push(timeDesc);
                    sectionIDs.push(sectionId);
                    dataBlobs[sectionId] = timeDesc;
                    rowIDs.push([]);
                    index = sectionIDs.length - 1;
                }
                groupByTimeDesc[timeDesc].forEach((item) => {
                    let id = item.id || "";
                    dataBlobs[id] = item;
                    rowIDs[index].push(id)
                });
            });
            runInAction(() => {
                this.pageInfo.pageCount = pageInfo.pageCount;
                this.isLoading = false;
                this.listViewDataSource = this.listViewDataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs);
            });
        });
    }

    asyncLoadUserInfo() {
        billApi.billList.getUserInfo()
            .then((d) => {
                this.userInfo = d.data[0];
            });
    }

    groupByTimeDesc(data = []) {
        let groupByTimeDesc = {};
        data.forEach((item) => {
            let {timeDesc = ""} = item;
            if (!groupByTimeDesc[timeDesc]) {
                groupByTimeDesc[timeDesc] = [];
            }
            groupByTimeDesc[timeDesc].push(item);
        });
        return groupByTimeDesc;
    }

    resetCacheAndPage() {
        this.cacheData = {
            dataBlobs: {},
            rowIDs: [],
            sectionIDs: [],
            timeDescList: []
        };
        this.pageInfo = {
            pageSize: 15,
            pageIndex: 1,
        }
    }
}

@withRouter
@observer
export default class BillList extends React.Component {
    static BILL_CONSUME = "支出";
    static BILL_INCOME = "收入";
    static BILL_TRANSFER = "互转";
    static BILL_CREDIT = "信用卡还款";

    static propTypes = {
        onAddClick: PropTypes.any,
        onItemClick: PropTypes.any,
    };

    _addBillType = [
        {value: BillList.BILL_CONSUME, label: BillList.BILL_CONSUME},
        {value: BillList.BILL_INCOME, label: BillList.BILL_INCOME},
        {value: BillList.BILL_TRANSFER, label: BillList.BILL_TRANSFER},
        {value: BillList.BILL_CREDIT, label: BillList.BILL_CREDIT},
    ];
    _appState = new AppState();
    _listView;

    componentDidMount() {
        this._appState.asyncLoadUserInfo();
        this._appState.asyncLoadData();
    }

    onItemClick = (rowData) => {
        let billTypeId = rowData["bill_type_id"];
        let billTypeType = rowData["bill_type_type"];

        if (billTypeId === "6efb4370-4868-11e9-a5f7-8d7957d89dc7") {
            this.props.history.push("/content/nav-bar/billedit/credit", {data: rowData});
        } else if (billTypeType==="1") {
            this.props.history.push("/content/nav-bar/billedit/income", {data: rowData});
        }else if (billTypeType==="-1") {
            this.props.history.push("/content/nav-bar/billedit/consume", {data: rowData});
        }else if (billTypeType==="0") {
            this.props.history.push("/content/nav-bar/billedit/transfer", {data: rowData});
        }
    };

    onAddClick = () => {
        this.props.history.push("/content/nav-bar/bill-add/" + undefined);
    };

    @action
    onSelectOnlyOwn = (selected) => {
        //选中状态改变后，需要重新加载数据
        this._appState.resetCacheAndPage();
        this._appState.selectOnlyMe = selected;
        this._appState.asyncLoadData();
        if (this._listView) {
            this._listView.scrollTo(0, 0);
        }
    };

    renderItem = (rowData, sectionID, rowID, highlightRow) => {
        let pic = rowData["pic"];
        let money = rowData["money"];

        let income = money > 0;
        let showMoney = income ? " + " + money : " - " + Math.abs(money);
        let layout = income ? {color: "red"} : {color: "black"};
        return (
            <List.Item thumb={pic}
                       extra={<h3 style={layout}>{showMoney}</h3>}
                       wrap={true}
                       onClick={() => {
                           this.onItemClick(rowData);
                       }}
            >
                {
                    rowData["bill_desc"]
                }
                <List.Item.Brief style={{fontSize: "0.5rem"}}>
                    <Flex direction={"row"}>
                        {rowData["bill_type_name"]}
                        <WingBlank size={"sm"}/>
                        {rowData["cardUserName"] + " - " + rowData["card_name"]}
                    </Flex>
                </List.Item.Brief>
                <List.Item.Brief style={{fontSize: "0.5rem"}}>
                    {rowData["date_time"]}
                </List.Item.Brief>
            </List.Item>
        );
    };

    renderSeparator = (sectionID, rowID) => {
        return (
            <div
                key={rowID}
                style={{
                    backgroundColor: "#F5F5F9",
                    height: 1,
                    borderTop: "1px solid #ECECED",
                    borderBottom: "1px solid #ECECED"
                }}
            />
        )
    };

    renderSectionHeader = (sectionData) => {
        return <h3>{sectionData}</h3>;
    };

    renderFooter = () => {
        return (
            <div style={{padding: 30, textAlign: 'center'}}>
                {this._appState.isLoading ? 'Loading...' : 'Loaded'}
            </div>
        )
    };

    renderSectionWrapper = (sectionID) => {
        return (
            <StickyContainer
                // style={{zIndex: 4}}
                // key={`s_${sectionID}_c`}
                // className="sticky-container"
            />
        )
    };

    onEndReached = () => {
        let pageInfo = this._appState.pageInfo;
        if (pageInfo.pageIndex < pageInfo.pageCount) {
            pageInfo.pageIndex = pageInfo.pageIndex + 1;
            this._appState.asyncLoadData();
        }
    };

    renderFooter = () => {
        return (
            <div style={{padding: 30, textAlign: 'center'}}>
                {this._appState.isLoading ? "Loading..." : "loaded"}
            </div>
        );
    };

    onPickerSelect = (value) => {
        let id = value[0];
        if (id === BillList.BILL_INCOME) {
            this.props.history.push("/content/nav-bar/billedit/income", {});
        } else if (id === BillList.BILL_CONSUME) {
            this.props.history.push("/content/nav-bar/billedit/consume", {});
        } else if (id === BillList.BILL_TRANSFER) {
            this.props.history.push("/content/nav-bar/billedit/transfer", {});
        } else if (id === BillList.BILL_CREDIT) {
            this.props.history.push("/content/nav-bar/billedit/credit", {});
        }
    };

    render() {
        return (
            <Flex style={globalStyles.container}
                  direction={"column"}
                  align={"center"}>
                <Flex style={{width: "100%", backgroundColor: "rgba(255,255,255,0.5)"}}
                      direction={"column"}>
                    <WhiteSpace size={"sm"}/>
                    <Flex style={{width: "100%"}}
                          direction={"row"}>
                        <WingBlank size={"sm"}/>
                        <Tag
                            selected={this._appState.selectOnlyMe}
                            onChange={this.onSelectOnlyOwn}>仅自己</Tag>
                    </Flex>
                    <WhiteSpace size={"sm"}/>
                </Flex>

                <Flex.Item style={{width: "100%", position: "relative"}}>
                    <ListView
                        ref={(e) => {
                            this._listView = e
                        }}
                        style={{width: "100%", height: "100%"}}
                        dataSource={toJS(this._appState.listViewDataSource)}
                        renderRow={this.renderItem}
                        renderSectionHeader={this.renderSectionHeader}
                        onEndReached={this.onEndReached}
                        renderFooter={() => (
                            <div style={{padding: 30, textAlign: 'center'}}>
                                {this._appState.isLoading ? 'Loading...' : 'Loaded'}
                            </div>
                        )}
                        initialListSize={15}
                        pageSize={15}
                        renderSeparator={this.renderSeparator}
                    />
                </Flex.Item>

                <Picker
                    title={"记账类型"}
                    data={this._addBillType}
                    cols={1}
                    onOk={this.onPickerSelect}
                >
                    <AddIcon/>
                </Picker>
            </Flex>
        )
    }
}
