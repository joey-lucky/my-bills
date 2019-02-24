import * as React from "react";
import {Tabs} from "antd-mobile";
import {barState} from "../index";
import {observer} from "mobx-react";
import BillTypeList from "./BillTypeList";
import CardTypeList from "./CardTypeList";
import CardList from "./CardList";

@observer
export default class SettingContent extends React.Component {
    _tabs = [
        { title: '卡类型列表', sub: '1' },
        { title: '账单类型列表', sub: '2' },
        { title: '银行卡列表', sub: '3' },
    ];

    onTabClick=(tab, index)=>{
        barState.tabBar.index = index;
    };

    render(){
        return (
            <Tabs tabs={this._tabs}
                  page={barState.tabBar.index}
                  tabBarPosition={"top"}
                  renderTab={tab => <span>{tab.title}</span>}
                  onTabClick={this.onTabClick}
            >
                <CardTypeList/>
                <BillTypeList/>
                <CardList/>
            </Tabs>
        );
    }
}