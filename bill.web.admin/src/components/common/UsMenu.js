import React from "react";
import * as PropTypes from "prop-types";
import {Route, withRouter} from "react-router-dom";
import {Icon, Menu} from "antd";
import * as styles from "./UsMenu.css";

const SubMenu = Menu.SubMenu;

/**
 * 二次封装antd的Menu组件,
 * 实现menu组装；
 * 路由跳转；
 * 默认选中等通用逻辑
 */
@withRouter
export default class UsMenu extends React.Component {
    static propTypes = {
        location: PropTypes.any,
        history: PropTypes.any,
        menuInfos: PropTypes.any,
        basePath: PropTypes.any
    };

    constructor(props) {
        super(props);
        let defaultPath = props.location.pathname;
        let defaultPathInfos = [];

        if (defaultPath !== null) {

            let pathInfos = defaultPath.split("/");
            let defaultOpenPath = null;

            for (let i = 0; i < pathInfos.length; i++) {
                if (defaultOpenPath === null) {
                    defaultOpenPath = pathInfos[i];
                } else {
                    defaultOpenPath = defaultOpenPath + "/" + pathInfos[i];
                }
                defaultPathInfos.push(defaultOpenPath);
            }
        }

        this.state = {

            /**
             * 初次渲染组件，获取当前的路由，用于设置menu的初始选中状态
             */
            defaultPath: [defaultPath],

            /**
             * 用于设置menu默认展开状态
             */
            defaultPathInfos: defaultPathInfos
        };
    }

    onMenuSelect(item, key, selectedKeys) {
        this.props.history.push(item.key);
    }

    render() {
        return (
            <Menu
                className={styles.container}
                mode="inline"
                onSelect={(item, key) => this.onMenuSelect(item, key)}
                defaultOpenKeys={this.state.defaultPathInfos}
                defaultSelectedKeys={this.state.defaultPath}
            >
                {
                    this.props.menuInfos.map((menu, index) =>
                        menu.getMenu(this.props.basePath)
                    )
                }
            </Menu>
        );
    }
}

class MenuInfo {
    constructor(text, path, component, show) {
        this.text = text;
        this.path = path;
        this.show = show !== false;
        this.component = component;
        this.hasSubMenus = false;
        this.subMenus = [];
    }

    subMenu(text, path, component, show) {
        let menu = new MenuInfo(text, path, component, show);
        this.subMenus.push(menu);
        this.hasSubMenus = true;
        return menu;
    }

    getRouter(basePath) {
        let routers = [];
        this._getRouter(this, basePath, routers);
        return routers;
    }

    _getRouter(menu, basePath, routers) {
        if (!menu.hasSubMenus) {
            routers.push(
                <Route key={basePath + "/" + menu.path} path={basePath + "/" + menu.path} component={menu.component}/>
            );
        } else {
            menu.subMenus.map((subMenu, index) =>
                this._getRouter(subMenu, basePath + "/" + menu.path, routers)
            );
        }
    }

    getMenu(basePath) {
        let menus = this._getMenu(this, basePath);
        return menus;
    }

    /**
     * 递归构造antd的menu
     */
    _getMenu(menu, basePath) {
        if (!menu.hasSubMenus) {
            if (!menu.show) {
                return;
            } else {
                return (
                    <Menu.Item key={basePath + "/" + menu.path}>{menu.text}</Menu.Item>
                );
            }
        } else {
            return (
                <SubMenu
                    key={basePath + "/" + menu.path}
                    title={<span><Icon type="mail"/><span>{menu.text}</span></span>}
                >
                    {
                        menu.subMenus.map((subMenu, index) =>
                            this._getMenu(subMenu, basePath + "/" + menu.path)
                        )
                    }
                </SubMenu>
            );
        }
    }
}

export {MenuInfo};
