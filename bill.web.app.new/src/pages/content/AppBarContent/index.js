import {observer} from "mobx-react";
import React from "react";
import {TabBar} from "antd-mobile";
import {observable} from "mobx";
import DataContent from "./DataContent";
import SettingContent from "./SettingContent";

class BarState {
    @observable appBar = {
        hidden: false,
        index: 0,
    };
    @observable tabBar = {
        index:0,
    };
}

export const barState = new BarState();

@observer
export default class AppBarContent extends React.Component {
    onTabBarClick = (selectIndex) => {
        if (barState.appBar.index !== selectIndex) {
            barState.appBar.index = selectIndex;
            barState.tabBar.index = 0;
        }
    };

    renderTabBarIcon(url) {
        return (
            <div style={{
                width: '22px',
                height: '22px',
                background: `url(${url}) center center /  21px 21px no-repeat`
            }}/>
        );
    }

    render() {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={barState.hidden}
                tabBarPosition={"bottom"}
            >
                <TabBar.Item
                    title="数据"
                    icon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg")}
                    selectedIcon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg")}
                    selected={barState.appBar.index === 0}
                    onPress={() => this.onTabBarClick(0)}
                >
                    <DataContent/>
                </TabBar.Item>
                <TabBar.Item
                    title="数据"
                    key="setting"
                    icon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg")}
                    selectedIcon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg")}
                    selected={barState.appBar.index === 1}
                    onPress={() => this.onTabBarClick(1)}
                >
                    <SettingContent/>
                </TabBar.Item>
            </TabBar>
        );
    }
}
