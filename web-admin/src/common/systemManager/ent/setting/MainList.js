/**
 * 企业设置主列表
 */
import React from "react";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import EntDetail from "./ent/EntDetail";
import {entListState} from "./EntManager";
import StationList from "./site/SiteList";
import DeviceList from "./device/DeviceList";
import Tabs from "./Tabs";
import SitePollList from "./sitepoll/SitePollList";

const TabPane = Tabs.TabPane;

class AppState {
    siteState = StationList.newState();
    deviceState = DeviceList.newState();
    sitePollState = SitePollList.newState();

    set ent(ent) {
        this.detailState.data = ent;
    }
}

@observer
export default class MainList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    render() {
        const appState = this.props.state;
        return (
            <Tabs
                style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    borderLeft: "1px solid #eee",
                    backgroundColor: "white"
                }}
                defaultActiveKey="企业详情"
            >
                <TabPane tab="企业详情" key="企业详情" forceRender={false} style={{height: "100%"}}>
                    <EntDetail
                        state={entListState.detailState}
                    />
                </TabPane>
                <TabPane tab="站点信息" key="站点信息" forceRender={false} style={{height: "100%"}}>
                    <StationList
                        state={appState.siteState}
                    />
                </TabPane>
                <TabPane tab="设备信息" key="设备信息" forceRender={false} style={{height: "100%"}}>
                    <DeviceList
                        state={appState.deviceState}
                    />
                </TabPane>
                <TabPane tab="参数信息" key="参数信息" forceRender={false} style={{height: "100%"}}>
                    <SitePollList
                        state={appState.sitePollState}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
