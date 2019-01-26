import {Layout} from "antd";
import React from "react";
import {withRouter} from "react-router-dom";
import {RouteMenu, RouteContent} from "@components/RouteComponents";

const {Content, Sider} = Layout;

@withRouter
export default class CommonLayout extends React.Component {
    render() {
        return (
            <Layout className="fill-parent">
                <Sider collapsible style={{width: 20, background: "white", overflow: "auto"}}>
                    <RouteMenu childRouteData={this.props.childRouteData}/>
                </Sider>
                <Content className="fill-space-h">
                    {
                        <RouteContent
                            childRouteData={this.props.childRouteData}
                            defaultRouteIndex={0}/>
                    }
                </Content>
            </Layout>
        );
    }
}
