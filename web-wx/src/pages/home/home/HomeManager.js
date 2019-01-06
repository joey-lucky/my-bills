import {Layout} from "antd";
import React from "react";
import {withRouter} from "react-router-dom";

const {Content, Sider} = Layout;

/**
 * 在react-router 4.x版本中，使用withRouter把路由相关对象注入进来,也就是注入到props对象中
 */
@withRouter
export default class HomeManager extends React.Component {
    render() {
        return (
            <Layout className="fill-parent">

            </Layout>
        );
    }
}
