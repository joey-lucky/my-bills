import {observer} from "mobx-react";
import React from "react";
import {TabBar} from "antd-mobile";
import {observable} from "mobx";
import DataContent from "./DataContent";
import SettingContent from "./SettingContent";

@observer
export default class AppBarContent extends React.Component {
    @observable _tabBarState = {
        hidden: false,
        selectedTab: "data"
    };

    onTabBarClick = (tab) => {
        if (this._tabBarState.selectedTab !== tab) {
            this._tabBarState.selectedTab = tab;
        }
    };

    renderTabBarIcon(url) {
        return (
            <div style={{
                width: '22px',
                height: '22px',
                background: `'url(${url}) center center /  21px 21px no-repeat`
            }}/>
        );
    }

    render() {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={this._tabBarState.hidden}
                tabBarPosition={"bottom"}
            >
                <TabBar.Item
                    title="数据"
                    key="data"
                    icon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg")}
                    selectedIcon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg")}
                    selected={this._tabBarState.selectedTab === "data"}
                    badge={1}
                    onPress={() => this.onTabBarClick("data")}
                >
                    <DataContent/>
                </TabBar.Item>
                <TabBar.Item
                    title="数据"
                    key="setting"
                    icon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg")}
                    selectedIcon={this.renderTabBarIcon("https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg")}
                    selected={this._tabBarState.selectedTab === "setting"}
                    badge={1}
                    onPress={() => this.onTabBarClick("setting")}
                >
                    <SettingContent/>
                </TabBar.Item>
            </TabBar>
        );
    }
}
