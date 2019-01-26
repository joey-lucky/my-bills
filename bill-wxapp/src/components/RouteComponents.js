import React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import {Icon, Menu} from "antd";
import * as PropTypes from "prop-types";

const {SubMenu} = Menu;

class DefaultContent extends React.Component {
    render() {
        return (
            <div>
                未配置
            </div>
        );
    }
}

@withRouter
export class NavRouteContent extends React.Component {
    static propTypes = {
        defaultRouteIndex: PropTypes.number,
        childRouteData:PropTypes.any
    };

    constructor(props) {
        super(props);
        const {childRouteData = [], match: {path = ""}} = props;
        this.state = {
            routeNode: this._getRoutes(childRouteData, path),
            routePaths: this._getRoutePaths(childRouteData, path)
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], match: {path = ""}} = this.props;
        let {childRouteData: nextChildRouteData, match: {path: nextPath = ""}} = nextProps;
        if (childRouteData.length !== nextChildRouteData.length && path !== nextPath) {
            this.setState({
                routeNode: this._getRoutes(childRouteData, path),
                routePaths: this._getRoutePaths(childRouteData, path)
            })
        }
    }

    //获取所有的路由
    _getRoutes(routeData = [], parentPath = "") {
        //高阶组件，注入childRouteData
        let wrapComponent = item => props => (
            <item.component
                {...props}
                childRouteData={item.children}
            />
        );
        let routes = [];
        routeData.forEach((item) => {
            let path = parentPath + item.path;
            if (item.component) {
                routes.push(
                    <Route
                        key={path}
                        path={path}
                        component={wrapComponent(item)}
                    />
                );
            } else {
                routes.push(
                    <Route
                        key={path}
                        path={path}
                        component={DefaultContent}
                    />
                )
            }
        });
        return routes;
    }

    //获取所有的路由地址
    _getRoutePaths(routeData = [], parentPath = "") {
        let routePaths = [];
        if (routeData && routeData.length > 0) {
            routeData.forEach((item) => {
                let path = parentPath + item.path;
                routePaths.push(path);
            });
        }
        return routePaths;
    }

    render() {
        let {defaultRouteIndex = 0} = this.props;
        let defaultRoutePath = this.state.routePaths[defaultRouteIndex];
        return (
            <Switch>
                {
                    this.state.routeNode
                }
                {
                    defaultRoutePath && <Redirect to={defaultRoutePath}/>
                }
            </Switch>
        );
    }


}

@withRouter
export class RouteContent extends React.Component {
    static propTypes = {
        defaultRouteIndex: PropTypes.number,
        childRouteData:PropTypes.any
    };

    _routePaths = [];

    constructor(props) {
        super(props);
        const {childRouteData = [], match: {path = ""}} = props;
        this._routePaths = this._getRoutePaths(childRouteData, path);
        this.state = {
            routeNode: this._getRoutes(childRouteData, path),
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], match: {path = ""}} = this.props;
        let {childRouteData: nextChildRouteData, match: {path: nextPath = ""}} = nextProps;
        if (childRouteData.length !== nextChildRouteData.length && path !== nextPath) {
            this._routePaths = this._getRoutePaths(childRouteData, path);
            this.setState({
                routeNode: this._getRoutes(childRouteData, path),
            })
        }
    }

    //获取所有的路由
    _getRoutes(routeData = [], parentPath = "") {
        let routes = [];
        routeData.forEach((item) => {
            let path = parentPath + item.path;
            if (item.children && item.children.length > 0) {
                routes.push(...this._getRoutes(item.children, path));
            } else {
                routes.push(
                    <Route
                        key={path}
                        path={path}
                        component={item.component}
                    />
                );
            }
        });
        return routes;
    }

    //获取所有的路由地址
    _getRoutePaths(routeData = [], parentPath = "") {
        let routePaths = [];
        if (routeData && routeData.length > 0) {
            routeData.forEach((item) => {
                let path = parentPath + item.path;
                if (item.children && item.children.length > 0) {
                    routePaths.push(...this._getRoutePaths(item.children, path));
                } else {
                    routePaths.push(path);
                }
            });
        }
        return routePaths;
    }

    render() {
        let {defaultRouteIndex = 0} = this.props;
        let defaultRoutePath =  this._routePaths[defaultRouteIndex];
        return (
            <Switch>
                {
                    this.state.routeNode
                }
                {defaultRoutePath && <Redirect to={defaultRoutePath}/>}
            </Switch>
        );
    }


}

@withRouter
export class RouteMenu extends React.Component {
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
            routeNode: childRouteData.map((item) => this._getRouteNode(item, path))
        };
        this._firstOpen = this.state.openKeys.length === 0;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], location: {pathname = ""}} = this.props;
        let {childRouteData: nextChildRouteData, location: {pathname: nextPathname = ""}} = nextProps;

        if (childRouteData.length !== nextChildRouteData.length) {
            //路由数据改变(权限改变的时候)
            let {match: {path: nextPath = ""}} = nextProps;
            this._routePaths = this._getRoutePaths(nextChildRouteData, nextPath);
            this.setState({
                routeNode: nextChildRouteData.map((item) => this._getRouteNode(item, path)),
                selectedKeys: this._getSelectedKeys(nextPathname)
            });
        } else if (pathname !== nextPathname) {
            //URL地址改变
            if (this._firstOpen) {
                this.setState({
                    selectedKeys: this._getSelectedKeys(nextPathname),
                    openKeys: this._getSelectedKeys(nextPathname),
                });
            } else {
                this.setState({
                    selectedKeys: this._getSelectedKeys(nextPathname),
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
            }else {
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
                    <SubMenu
                        key={path}
                        title={<span><Icon type="mail"/><span>{name}</span></span>}
                    >
                        {
                            children.map((item) => {
                                return this._getRouteNode(item, path);
                            })
                        }
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item className={"xxx111"} key={path}>{name}</Menu.Item>
                );
            }
        } else {
            return null;
        }
    }

    render() {
        const {childRouteData, location, ...menuProps} = this.props;
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
                    this.state.routeNode
                }
            </Menu>
        );
    }
}


