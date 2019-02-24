import * as React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Flex, List, ListView} from "antd-mobile";
import {StickyContainer} from "react-sticky";
import {billApi} from "@services/api";
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

    asyncLoadData() {
        this.listViewDataSource = this.listViewDataSource.cloneWithRowsAndSections({}, [], []);
        billApi.list().then((d) => {
            let data = d.data || [];
            let dataBlobs = {};
            let sectionIDs = [];
            let rowIDs = [];
            //分组
            let groupByTimeDesc = data.reduce((pre, curr) => {
                let type = curr.timeDesc || "xx";
                if (!pre[type]) {
                    pre[type] = [];
                }
                pre[type].push(curr);
                return pre;
            }, {});
            Object.keys(groupByTimeDesc)
                .forEach((timeDesc, i) => {
                    sectionIDs.push(timeDesc);
                    dataBlobs[timeDesc] = timeDesc;
                    rowIDs[i] = [];
                    groupByTimeDesc[timeDesc]
                        .forEach((item, ii) => {
                            let id = item.id || "";
                            dataBlobs[id] = item;
                            rowIDs[i].push(id)
                        });
                });
            this.listViewDataSource = this.listViewDataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs);
        });
    }
}

@withRouter
@observer
export default class BillList extends React.Component {
    static propTypes = {
        onAddClick: PropTypes.any,
        onItemClick:PropTypes.any,
    };

    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onItemClick = (rowData) => {
        this.props.history.push("/content/nav-bar/bill-add/"+rowData.id);
    };

    onAddClick = () => {
        this.props.history.push("/content/nav-bar/bill-add/"+undefined);
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
                    {rowData["bill_type_name"]}
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
        //
        // return (
        //     <Sticky>
        //         {
        //             ({style}) => (
        //                 <h6
        //                     style={{
        //                         ...style,
        //                         zIndex: 3,
        //                         backgroundColor: "gray"
        //                     }}
        //                 >{sectionData}</h6>
        //             )
        //         }
        //     </Sticky>
        // )
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

    render() {
        return (
            <Flex style={globalStyles.container}
                  direction={"column"}
                  align={"center"}>
                <Flex.Item style={{width: "100%", position: "relative"}}>
                    {/*<ListView*/}
                    {/*className="am-list sticky-list"*/}
                    {/*style={{width: "100%", height: "100%"}}*/}
                    {/*dataSource={toJS(this._appState.listViewDataSource)}*/}
                    {/*useBodyScroll={false}*/}
                    {/*renderSectionWrapper={this.renderSectionWrapper}*/}
                    {/*renderSectionHeader={this.renderSectionHeader}*/}
                    {/*renderFooter={this.renderFooter}*/}
                    {/*renderRow={this.renderItem}*/}
                    {/*renderSeparator={this.renderSeparator}*/}
                    {/*pageSize={4}*/}
                    {/*onScroll={() => {*/}
                    {/*console.log('scroll');*/}
                    {/*}}*/}
                    {/*scrollEventThrottle={200}*/}
                    {/*onEndReached={this.onEndReached}*/}
                    {/*onEndReachedThreshold={10}*/}
                    {/*/>*/}
                    <ListView style={{width: "100%", height: "100%"}}
                              dataSource={toJS(this._appState.listViewDataSource)}
                              renderRow={this.renderItem}
                              renderSectionHeader={this.renderSectionHeader}
                              initialListSize={15}
                              renderSeparator={this.renderSeparator}
                    />
                </Flex.Item>

                <AddIcon onAddClick={()=>{this.props.history.push("/content/nav-bar/bill-add/"+undefined);}}/>
            </Flex>
        )
    }
}
