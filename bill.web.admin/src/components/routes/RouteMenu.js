import {withRouter} from "react-router-dom";
import React from "react";
import * as PropTypes from "prop-types";
import {Icon, Menu} from "antd";

@withRouter
export default class RouteMenu extends React.Component {
    static propTypes = {
        childRouteData: PropTypes.any,
        history: PropTypes.any,
        match: PropTypes.any,
        location: PropTypes.any
    };

    // 缓存当前所有的路由
    _routePaths = [];
    _firstOpen = true;

    constructor(props) {
        super(props);
        const {childRouteData = [], match: {path = ""}} = props;
        this._routePaths = this._getRoutePaths(childRouteData, path);
        this.state = {
            selectedKeys: this._getSelectedKeys(props.location.pathname),
            openKeys: this._getSelectedKeys(props.location.pathname),
            routeNode: childRouteData.map(item => this._getRouteNode(item, path))
        };
        this._firstOpen = this.state.openKeys.length === 0;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], location: {pathname = ""}} = this.props;
        let {childRouteData: nextChildRouteData, location: {pathname: nextPathname = ""}} = nextProps;
        if (childRouteData.length !== nextChildRouteData.length) {
            // 路由数据改变(权限改变的时候)
            let {match: {path: nextPath = ""}} = nextProps;
            this._routePaths = this._getRoutePaths(nextChildRouteData, nextPath);
            this.setState({
                routeNode: nextChildRouteData.map(item => this._getRouteNode(item, path)),
                selectedKeys: this._getSelectedKeys(nextPathname)
            });
        } else if (pathname !== nextPathname) {
            // URL地址改变
            if (this._firstOpen) {
                this.setState({
                    selectedKeys: this._getSelectedKeys(nextPathname),
                    openKeys: this._getSelectedKeys(nextPathname)
                });
            } else {
                this.setState({
                    selectedKeys: this._getSelectedKeys(nextPathname)
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

    _getSelectedKeys(pathname = "") {
        return this._routePaths.filter((item) => {
            if (pathname === item) {
                return true;
            }
            return pathname.indexOf(item + "/") > -1;
        });
    }

    _getRoutePaths(routeData = [], parentRoutePath = "") {
        let routePaths = [];
        routeData.forEach((item) => {
            let {children = [], path = ""} = item;
            let routePath = parentRoutePath + path;
            routePaths.push(routePath);
            if (children.length > 0) {
                routePaths = routePaths.concat(this._getRoutePaths(children, routePath));
            }
        });
        return routePaths;
    }

    _getChildRoutePaths(routeData = [], parentRoutePath = "") {
        let routePaths = [];
        routeData.forEach((item) => {
            let {children = [], path = ""} = item;
            let routePath = parentRoutePath + path;
            if (children.length > 0) {
                routePaths = routePaths.concat(this._getChildRoutePaths(children, routePath));
            } else {
                routePaths.push(routePath);
            }
        });
        return routePaths;
    }

    _getRouteNode(routeData, parentPath = "") {
        if (routeData) {
            let path = parentPath + routeData.path;
            let name = routeData.name;
            let children = routeData.children || [];
            if (children && children.length > 0) {
                return (
                    <Menu.SubMenu
                        key={path}
                        title={<span><Icon type="profile" /><span>{name}</span></span>}
                    >
                        {
                            children.map(item => this._getRouteNode(item, path))
                        }
                    </Menu.SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={path} ><span><Icon type="mail"/><span>{name}</span></span></Menu.Item>
                );
            }
        } else {
            return null;
        }
    }

    render() {
        const {childRouteData, location,style = {}, ...menuProps} = this.props;
        return (
            <Menu
                {...menuProps}
                style={{...styles.container,...style}}
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

const styles = {
    container: {
        position: "relative",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden"
    }
};
