import * as React from "react";
import {Breadcrumb} from "antd";
import Type from "./Type";
import Data from "./Data";
import {Link, Route, Router} from "react-router-dom";
import * as styles from "./index.module.css";
import {Redirect} from "react-router";

export default class Dict extends React.Component {
    render() {
        const parentPath = this.props.match.path;
        const pathname = this.props.location.pathname;
        const childPath = pathname.substr(parentPath.length);
        const showData = childPath !== "/type";
        const typeRoutePath = parentPath + "/type";
        const dataRoutePath = parentPath + "/type/:typeCode";
        return (
            <div className={styles.container}>
                <Breadcrumb style={{padding:"12px"}}>
                    <Breadcrumb.Item key={typeRoutePath}>
                        <Link to={typeRoutePath}>字典类型</Link>
                    </Breadcrumb.Item>
                    {
                        showData &&
                        <Breadcrumb.Item key={dataRoutePath}>
                            字典数据
                        </Breadcrumb.Item>
                    }
                </Breadcrumb>
                <div className={styles.content}>
                    <Route
                        path={typeRoutePath}
                        component={Type}
                    />
                    <Route
                        path={dataRoutePath}
                        component={Data}
                    />
                    <Redirect to={typeRoutePath}/>
                </div>
            </div>
        );
    }
}