import {Layout} from "antd";
import React from "react";
import {withRouter} from "react-router-dom";
import RouteUtils from "../../component/RouteUtils";

const {Content, Sider} = Layout;

@withRouter
export default class extends React.Component {
    render() {
        return (
            <Layout className="fill-parent" >
                <Sider collapsible style={{width: 20, background: "white", overflow: "auto", height: "100%"}}>
                    {
                        RouteUtils.createMenuElement(this.props)
                    }
                </Sider>
                <Content className="fill-space-h">
                    {
                        RouteUtils.getFirstMenuRoute(this.props)
                    }
                </Content>
            </Layout>
        );
    }
}
