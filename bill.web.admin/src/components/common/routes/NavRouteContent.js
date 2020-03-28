import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import React from "react";
import {propTypes} from "@global";
import * as PropTypes from "prop-types";

function DefaultContent() {
    return <div> 未配置 </div>;
}

@withRouter
export default class NavRouteContent extends React.Component {
    static propTypes = {
        defaultRouteIndex: PropTypes.number,
        childRouteData: PropTypes.any,
    };

    constructor(props) {
        super(props);
        const {childRouteData = [], match: {path = ""}} = props;
        this.state = {
            routeNode: this.getRoutes(childRouteData, path),
            routePaths: this.getRoutePaths(childRouteData, path)
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {childRouteData = [], match: {path = ""}} = this.props;
        let {childRouteData: nextChildRouteData, match: {path: nextPath = ""}} = nextProps;
        if (childRouteData.length !== nextChildRouteData.length || path !== nextPath) {
            this.setState({
                routeNode: this.getRoutes(nextChildRouteData, nextPath),
                routePaths: this.getRoutePaths(nextChildRouteData, nextPath)
            });
        }
    }

    // 获取所有的路由
    getRoutes(routeData = [], parentPath = "") {
        if ("/" === parentPath) {
            parentPath = "";
        }
        // 高阶组件，注入childRouteData
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
                );
            }
        });
        return routes;
    }

    // 获取所有的路由地址
    getRoutePaths(routeData = [], parentPath = "") {
        if ("/" === parentPath) {
            parentPath = "";
        }
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
