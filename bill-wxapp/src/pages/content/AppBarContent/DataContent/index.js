import * as React from "react";
import {Tabs} from "antd-mobile";
import Stat from "./Stat";
import CardAsset from "./CardAsset";
import BillList from "./BillList";
import {barState} from "../index";
import {observer} from "mobx-react";

@observer
export default class DataContent extends React.Component {
    _tabs = [
        {title: '账单列表', sub: '1'},
        {title: '汇总统计', sub: '2'},
        {title: '资产概况', sub: '3'},
    ];

    onTabClick=(tab, index)=>{
        barState.tabBar.index = index;
    };

    render() {
        return (
            <Tabs tabs={this._tabs}
                  page={barState.tabBar.index}
                  initialPage={0}
                  tabBarPosition={"top"}
                  renderTab={tab => <span>{tab.title}</span>}
                  onTabClick={this.onTabClick}
            >
                <BillList/>
                <Stat/>
                <CardAsset/>
            </Tabs>
        );
    }
}