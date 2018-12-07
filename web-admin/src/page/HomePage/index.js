import {Divider, Modal} from "antd";
import {createBrowserHistory} from "history";
import {observer} from "mobx-react";
import * as React from "react";
import {NavLink, Router} from "react-router-dom";
import * as styles from "./index.css";
import RouteUtils from "../../component/RouteUtils";
import ScreenState from "../../component/ScreenState";
import PreviewPhotoDialog from "../../component/PreviewPhotoDialog";
import Ajax from "../../services/Ajax";
import routes from "../../routes";

const confirm = Modal.confirm;

export const globalHistory = createBrowserHistory({basename: "/op/front"});

export const screenState = new ScreenState();
export const previewPhotoState = PreviewPhotoDialog.newState();

@observer
export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:""
        };
        Ajax.httpGet("/safe/get-userinfo").then((d) => {
            // if (d.data && d.data[0]) {
            //     routeState.filterRoute(d.data);
            //     this.setState({
            //         userName: d.data[0].USER_NAME
            //     });
            // }
        });
    }

    onLoginOutClick = () => {
        confirm({
            title: "确定退出吗？",
            okText: "确定",
            cancelText: "取消",
            onOk() {
                Ajax.httpGet("/safe/logout").then(function (d) {
                    window.location.href = window.getBasePath() + "/login.html";
                });
            },
            onCancel() {

            }
        });
    };
    render() {
        let {match} = this.props;

        return (
            <div className={styles.container}>
                <PreviewPhotoDialog state={previewPhotoState}/>
                <div className={styles.header}>
                    <div className={styles.icon}>浩瑞泰运营平台</div>
                    <div className={styles.tab}>
                        {
                            routes.map((item, index) =>
                                <NavLink
                                    key={item.path}
                                    activeClassName={styles.selected}
                                    to={item.path}
                                >{item.name}</NavLink>,
                            )
                        }
                    </div>
                    <ul className={styles.tool}>
                        <li className={styles.versions}>版本号：v2.5 beta</li>
                        <li className={styles.exit}>
                            <span>{this.state.userName}</span>
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
                        RouteUtils.getNavMenuRoute({childRouteData: routes,match})
                    }
                </div>
            </div>
        );
    }
}
