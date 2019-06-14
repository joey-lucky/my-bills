import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import React from "react";
import * as PropTypes from "prop-types";
import {propTypes} from "@global";

@withRouter
export default class RouteContent extends React.Component {
    static propTypes = {
        defaultRouteIndex: PropTypes.number,
        childRouteData: PropTypes.any,
        ...propTypes.routeComponent
    };

    _routePaths = [];

    constructor(props) {
        super(props);
        const {childRouteData = [], match: {path = ""}} = props;
        this._routePaths = this.getRoutePaths(childRouteData, path);
        this.state = {
            routeNode: this.getRoutes(childRouteData, path)
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], match: {path = ""}} = this.props;
        let {childRouteData: nextChildRouteData, match: {path: nextPath = ""}} = nextProps;
        if (childRouteData.length !== nextChildRouteData.length && path !== nextPath) {
            this._routePaths = this.getRoutePaths(childRouteData, path);
            this.setState({
                routeNode: this.getRoutes(childRouteData, path)
            });
        }
    }

    // 获取所有的路由
    getRoutes(routeData = [], parentPath = "") {
        console.log(parentPath);
        if (parentPath === "/") {
            parentPath = "";
        }
        let routes = [];
        routeData.forEach((item) => {
            let path = parentPath + item.path;
            if (item.children && item.children.length > 0) {
                routes.push(
                    <Route
                        key={path}
                        path={path}
                        component={props =>
                            <RouteContent
                                {...props}
                                defaultRouteIndex={0}
                                childRouteData={item.children}
                            />
                        }
                    />
                );
                // routes.push(...this.getRoutes(item.children, path));
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

    // 获取所有的路由地址
    getRoutePaths(routeData = [], parentPath = "") {
        if (parentPath === "/") {
            parentPath = "";
        }
        let routePaths = [];
        if (routeData && routeData.length > 0) {
            routeData.forEach((item) => {
                let path = parentPath + item.path;
                if (item.children && item.children.length > 0) {
                    routePaths.push(...this.getRoutePaths(item.children, path));
                } else {
                    routePaths.push(path);
                }
            });
        }
        return routePaths;
    }

    render() {
        let {defaultRouteIndex = 0} = this.props;
        let defaultRoutePath = this._routePaths[defaultRouteIndex];
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
