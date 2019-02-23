import * as React from "react";
import {Tabs} from "antd-mobile";
import CardTypeManager from "./CardTypeManager";
import BillTypeManager from "./BillTypeManager";
import CardManager from "./CardManager";


export default class SettingContent extends React.Component {
    _tabs = [
        { title: '卡类型管理', sub: '1' },
        { title: '账单类型管理', sub: '2' },
        { title: '银行卡管理', sub: '3' },
    ];

    render(){
        return (
            <Tabs tabs={this._tabs}
                  initialPage={1}
                  tabBarPosition={"top"}
                  renderTab={tab => <span>{tab.title}</span>}
            >
                <CardTypeManager/>
                <BillTypeManager/>
                <CardManager/>
            </Tabs>
        );
    }
}