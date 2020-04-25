import {Layout, Spin} from "antd";
import React from "react";
import {withRouter} from "react-router-dom";
import * as PropTypes from "prop-types";
import {RouteContent, RouteMenu} from "@components";
import {waitDialogStore} from "@stores";

const {Content, Sider} = Layout;

@withRouter
export default class CommonLayout extends React.Component {
    static propTypes = {
        childRouteData: PropTypes.any,
    };

    render() {
        return (
            <Layout className={"fill-parent"}>
                <Sider collapsible style={{width: 20, background: "white", overflow: "auto"}}>
                    <RouteMenu childRouteData={this.props.childRouteData}/>
                </Sider>
                <Content className="fill-space-h">
                    <Spin
                        wrapperClassName="fill-parent"
                        size="large"
                        spinning={waitDialogStore.visible}
                        tip={waitDialogStore.text}
                    >
                        {
                            <RouteContent
                                childRouteData={this.props.childRouteData}
                                defaultRouteIndex={0}
                            />
                        }
                    </Spin>
                </Content>
            </Layout>
        );
    }
}
