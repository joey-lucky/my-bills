import * as React from "react";
import {Tabs} from "antd-mobile";
import Stat from "./Stat";
import CardAsset from "./CardAsset";
import BillManager from "./BillManager";


export default class DataContent extends React.Component {
    _tabs = [
        {title: '账单列表', sub: '1'},
        {title: '汇总统计', sub: '2'},
        {title: '资产概况', sub: '3'},
    ];
    render() {
        return (
            <Tabs tabs={this._tabs}
                  initialPage={0}
                  tabBarPosition={"top"}
                  renderTab={tab => <span>{tab.title}</span>}
            >
                <BillManager/>
                <Stat/>
                <CardAsset/>
            </Tabs>
        );
    }
}