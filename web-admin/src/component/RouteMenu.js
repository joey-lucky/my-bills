import React from "react";
import {withRouter} from "react-router-dom";
import {Icon, Menu} from "antd";
import * as PropTypes from "prop-types";

const {SubMenu} = Menu;

@withRouter
export default class RouteMenu extends React.Component {
    static propTypes = {
        childRouteData: PropTypes.any,
        history: PropTypes.any,
        match: PropTypes.any,
        location: PropTypes.any
    };

    /**
     * 路由数据是否发生改变
     */
    static isRouteDataChanged(props, nextProps) {
        let {childRouteData = [], match: {path = ""}} = props;
        if (path !== nextProps.match.path) {
            return true;
        }
        const nextChildRouteData = nextProps.childRouteData || [];
        return childRouteData.length !== nextChildRouteData.length;
    }

    /**
     * 获取所有的路由路径
     */
    static getAllRoutePaths(props) {
        function getRoutePaths(routeData = [], parentRoutePath = "") {
            let routePaths = [];
            routeData.forEach((item) => {
                let {children = [], path = ""} = item;
                let routePath = parentRoutePath + path;
                routePaths.push(routePath);
                if (children.length > 0) {
                    routePaths = routePaths.concat(getRoutePaths(children, routePath));
                }
            });
            return routePaths;
        }

        const {childRouteData = [], match: {path = ""}} = props;
        return getRoutePaths(childRouteData, path);
    }


    // 缓存当前所有的路由
    _routePaths = [];

    constructor(props) {
        super(props);
        this._routePaths = RouteMenu.getAllRoutePaths(this.props);
        let selectedKeys = this.getSelectedKeys(this.props);
        this.state = {
            selectedKeys: selectedKeys,
            openKeys: selectedKeys
        };
    }

    componentWillReceiveProps(nextProps) {
        if (RouteMenu.isRouteDataChanged(this.props, nextProps)) {
            this._routePaths = RouteMenu.getAllRoutePaths(nextProps);
        }
        if (nextProps.location.pathname !== this.props.location.pathname) {
            let selectedKeys = this.getSelectedKeys(nextProps);
            this.setState({
                selectedKeys: selectedKeys
            });
        }
    }

    /**
     * 获取选中项
     */
    getSelectedKeys(props) {
        let pathname = props.location.pathname;
        return this._routePaths.filter((item) => {
            if (pathname === item) {
                return true;
            }
            return pathname.indexOf(item + "/") > -1;
        });
    }

    getMenu = (item, parentPath = "") => {
        let path = parentPath + item.path;
        if (item.children && item.children.length > 0) {
            return (
                <SubMenu
                    key={path}
                    title={<span><Icon type="mail"/><span>{item.name}</span></span>}
                >
                    {
                        item.children.map((childItem, index) => this.getMenu(childItem, path))
                    }
                </SubMenu>
            );
        } else {
            return (
                <Menu.Item
                    key={path}
                >{item.name}</Menu.Item>
            );
        }
    };

    onOpenChange = (openKeys = []) => {
        this.setState({
            openKeys: openKeys
        });
    };

    onSelect = (item) => {
        this.props.history.push(item.key);
    };

    render() {
        const {childRouteData, ...menuProps} = this.props;
        delete menuProps.location;
        const {match} = this.props;
        const {path} = match;
        return (
            <Menu
                {...menuProps}
                style={{position: "relative", height: "100%", width: "100%", overflowY: "auto", overflowX: "hidden"}}
                mode="inline"
                openKeys={this.state.openKeys}
                selectedKeys={this.state.selectedKeys}
                onSelect={this.onSelect}
                onOpenChange={this.onOpenChange}
            >
                {
                    childRouteData.map((item, index) => this.getMenu(item, path))
                }
            </Menu>
        );
    }
}
