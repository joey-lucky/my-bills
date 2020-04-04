import {withRouter} from "react-router-dom";
import React from "react";
import * as PropTypes from "prop-types";
import {Menu} from "antd";
import { MailOutlined,ProfileOutlined } from '@ant-design/icons';

@withRouter
export default class RouteMenu extends React.Component {
    static propTypes = {
        childRouteData: PropTypes.any,
    };

    // 缓存当前所有的路由
    _routePaths = [];
    _firstOpen = true;

    constructor(props) {
        super(props);
        const {childRouteData = [], match: {path = ""}} = props;
        this._routePaths = this.getRoutePaths(childRouteData, path);
        this.state = {
            selectedKeys: this.getSelectedKeys(props.location.pathname),
            openKeys: this.getSelectedKeys(props.location.pathname),
            routeNode: childRouteData.map(item => this.getRouteNode(item, path))
        };
        this._firstOpen = this.state.openKeys.length === 0;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], location: {pathname = ""}} = this.props;
        let {childRouteData: nextChildRouteData, location: {pathname: nextPathname = ""}} = nextProps;
        if (childRouteData.length !== nextChildRouteData.length) {
            // 路由数据改变(权限改变的时候)
            let {match: {path: nextPath = ""}} = nextProps;
            this._routePaths = this.getRoutePaths(nextChildRouteData, nextPath);
            this.setState({
                routeNode: nextChildRouteData.map(item => this.getRouteNode(item, nextPath)),
                selectedKeys: this.getSelectedKeys(nextPathname)
            });
        } else if (pathname !== nextPathname) {
            // URL地址改变
            if (this._firstOpen) {
                this.setState({
                    selectedKeys: this.getSelectedKeys(nextPathname),
                    openKeys: this.getSelectedKeys(nextPathname)
                });
            } else {
                this.setState({
                    selectedKeys: this.getSelectedKeys(nextPathname)
                });
            }
        }
    }

    onOpenChange = (openKeys = []) => {
        this._firstOpen = false;
        this.setState({
            openKeys: openKeys
        });
    };

    onSelect = (item) => {
        this.props.history.push(item.key);
    };

    getSelectedKeys(pathname = "") {
        return this._routePaths.filter((item) => {
            if (pathname === item) {
                return true;
            }
            return pathname.indexOf(item + "/") > -1;
        });
    }

    getRoutePaths(routeData = [], parentRoutePath = "") {
        let routePaths = [];
        routeData.forEach((item) => {
            let {children = [], path = ""} = item;
            let routePath = parentRoutePath + path;
            routePaths.push(routePath);
            if (children.length > 0) {
                routePaths = routePaths.concat(this.getRoutePaths(children, routePath));
            }
        });
        return routePaths;
    }

    getChildRoutePaths(routeData = [], parentRoutePath = "") {
        let routePaths = [];
        routeData.forEach((item) => {
            let {children = [], path = ""} = item;
            let routePath = parentRoutePath + path;
            if (children.length > 0) {
                routePaths = routePaths.concat(this.getChildRoutePaths(children, routePath));
            } else {
                routePaths.push(routePath);
            }
        });
        return routePaths;
    }

    getRouteNode(routeData, parentPath = "") {
        if (routeData) {
            let path = parentPath + routeData.path;
            let name = routeData.name;
            let children = routeData.children || [];
            if (children && children.length > 0) {
                return (
                    <Menu.SubMenu
                        key={path}
                        title={<span><ProfileOutlined/><span>{name}</span></span>}
                    >
                        {
                            children.map(item => this.getRouteNode(item, path))
                        }
                    </Menu.SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={path} ><span><MailOutlined/><span>{name}</span></span></Menu.Item>
                );
            }
        } else {
            return null;
        }
    }

    render() {
        let props = {...this.props};
        delete props.childRouteData;
        delete props.staticContext;
        return (
            <Menu
                {...props}
                style={{position: "relative", height: "100%", width: "100%", overflowY: "auto", overflowX: "hidden"}}
                mode="inline"
                openKeys={this.state.openKeys}
                selectedKeys={this.state.selectedKeys}
                onSelect={this.onSelect}
                onOpenChange={this.onOpenChange}
            >
                {
                    this.state.routeNode
                }
            </Menu>
        );
    }
}
