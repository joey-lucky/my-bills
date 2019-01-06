import {Divider, Modal} from "antd";
import {observer} from "mobx-react";
import * as React from "react";
import {NavLink} from "react-router-dom";
import {Ajax} from "@utils/ajax";
import PreviewPhotoDialog, {previewPhotoState} from "@components/PreviewPhotoDialog";
import {publicPath} from "@global";
import {NavRouteContent} from "@components/RouteComponents";
import {observable, runInAction, toJS} from "mobx";
import routes from "./routes";
import * as styles from "./HomePage.css";

const confirm = Modal.confirm;

Ajax.errorHandle = (xmlHttpRequest, textStatus, errorThrown) => {
    console.log(xmlHttpRequest);
    if (xmlHttpRequest.status === 403 || xmlHttpRequest.status === 302 || xmlHttpRequest.status === 0) {
        window.location.href = publicPath+"/login"
    }
};

class AppState {
    @observable routeData = [];
    @observable userName = "";

    asyncLoadUserInfo() {
        Ajax.apiPost("/safe/get-userinfo").then((d) => {
            if (d.data && d.data[0]) {
                let model = d.data[0];
                runInAction(() => {
                    this.userName = model["USER_NAME"];
                    this.filterRoute(d.data);
                });
            }
        });
    }

    asyncLoginOut() {
        Ajax.apiPost("/safe/logout").then(function (d) {
            window.location.href = publicPath + "/login";
        });
    }

    filterRoute(userData) {
        const data = userData[0];
        if (data.USER_ACCOUNT !== "admin") {
            const functions = data.FUNCTIONS;
            const functionSet = new Set();
            functions.forEach((item) => {
                functionSet.add(item.CODE);
            });
            this.routeData = this._getHasFunctionList(routes, functionSet);
        } else {
            this.routeData = routes;
        }
    }

    _getHasFunctionList(list, functionSet) {
        if (list && list.length > 0) {
            // 筛选出符合条件的路由
            const data = list.filter(item => functionSet.has(item.functionCode));
            // 处理子路由
            data.forEach((item) => {
                item.children = this._getHasFunctionList(item.children, functionSet);
            });
            return data;
        }
        return [];
    }
}

@observer
export default class HomePage extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        this._appState.asyncLoadUserInfo();
    }

    onLoginOutClick = () => {
        confirm({
            title: "确定退出吗？",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                this._appState.asyncLoginOut();
            }
        });
    };

    render() {
        let {path: parentPath} = this.props.match;
        let {routeData, userName} = this._appState;
        routeData = toJS(routeData);
        return (
            <div className={styles.container}>
                <PreviewPhotoDialog state={previewPhotoState}/>
                <div className={styles.header}>
                    <div className={styles.icon}>浩瑞泰运营平台</div>
                    <div className={styles.tab}>
                        {
                            routeData.map((item, index) =>
                                <NavLink
                                    key={parentPath + item.path}
                                    activeClassName={styles.selected}
                                    to={parentPath + item.path}>
                                    {item.name}
                                </NavLink>,
                            )
                        }
                    </div>
                    <ul className={styles.tool}>
                        <li className={styles.versions}>版本号：v2.5 beta</li>
                        <li className={styles.exit}>
                            <span>{userName}</span>
                            <Divider type="vertical"/>
                            <a
                                href="javascript:void(0)"
                                style={{color: "white"}}
                                onClick={this.onLoginOutClick}
                            >退出</a>
                        </li>
                    </ul>
                </div>
                <div className={styles.contentContainer}>
                    {
                        routeData.length > 0 &&
                        <NavRouteContent
                            childRouteData={routeData}
                            defaultRouteIndex={routeData.length - 1}
                        />
                    }
                </div>
            </div>
        );
    }
}
