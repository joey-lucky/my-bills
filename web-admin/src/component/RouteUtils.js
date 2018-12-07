import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import RouteMenu from "./RouteMenu";

export default class RouteUtils {

    /**
     * NAV路由获取
     * @param childRouteData 路由数据
     * @param defaultRouteIndex 默认跳转路由
     * @returns XML Switch组件
     */
    static getNavMenuRoute({childRouteData = [], match = {path: ""},defaultRouteIndex = 0}) {
        if (childRouteData && childRouteData.length > 0) {
            return (
                <Switch>
                    {
                        childRouteData.map((item, index) => {
                            let WrapComponent = props => (
                                <item.component
                                    {...props}
                                    childRouteData={item.children}
                                />
                                );
                            return (
                                <Route
                                    key={match.path+item.path}
                                    path={match.path+item.path}
                                    component={WrapComponent}
                                />
                            );
                        })
                    }
                    <Redirect to={match.path+childRouteData[defaultRouteIndex].path} />
                </Switch>
            );
        } else {
            return null;
        }
    }

    /**
     * 只获取第一层路由
     * @param childRouteData 路由数据
     * @param parentPath 父路由地址
     * @param defaultRouteIndex 默认跳转路由
     * @returns XML Switch组件
     */
    static getFirstMenuRoute({childRouteData = [], match = {path: ""}, defaultRouteIndex = 0}) {
        if (childRouteData && childRouteData.length > 0) {
            let parentPath = match.path;
            let redirectPath = parentPath + childRouteData[defaultRouteIndex].path;
            return (
                <Switch>
                    {
                        childRouteData.map((item, index) =>
                            <Route
                                key={parentPath + item.path}
                                path={parentPath + item.path}
                                component={item.component}
                            />
                        )
                    }
                    <Redirect to={redirectPath} />
                </Switch>
            );
        } else {
            return null;
        }
    }

    /**
     * 只获取第二层路由（系统设置的菜单，只有第二层路由是可用）
     * @param childRouteData 路由数据
     * @param parentPath 父路由地址
     * @param defaultRouteIndex 默认跳转路由
     * @returns XML Switch组件
     */
    static getSecondMenuRoute({childRouteData = [], match = {path: ""}, defaultRouteIndex = 0}) {
        let parentPath = match.path;
        let routes = [];
        let routePaths = [];
        childRouteData.forEach((item) => {
            let path = parentPath + item.path;
            if (item.children && item.children.length > 0) {// 有子类的路由
                item.children.forEach((childItem) => {
                    routes.push(
                        <Route
                            key={path + childItem.path}
                            path={path + childItem.path}
                            component={childItem.component}
                        />
                    );
                    routePaths.push(path + childItem.path);
                });
            }
        });
        return (
            <Switch>
                {
                    routes
                }
                {routePaths[defaultRouteIndex] && <Redirect to={routePaths[defaultRouteIndex]} />}
            </Switch>
        );
    }

    static createMenuElement({childRouteData}) {
        return (
            <RouteMenu
                childRouteData={childRouteData}
            />
        );
    }
}
