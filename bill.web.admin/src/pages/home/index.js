import {Modal} from "antd";
import {observer} from "mobx-react";
import * as React from "react";
import * as PropTypes from "prop-types";
import {authStore, htmlStore} from "@stores";
import {computed, toJS} from "mobx";
import * as styles from "./index.module.css";
import Header from "./Header";
import {NavRouteContent} from "@components";

@observer
export default class Home extends React.Component {
    static propTypes = {
        childRouteData: PropTypes.any,
        history: PropTypes.any,
    };
    passwordRef = React.createRef();

    @computed
    get routeData() {
        let {childRouteData = []} = this.props;
        let {permissionSet, userInfo} = authStore;
        return childRouteData;
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    onLoginOutClick = () => {

    };

    onChangPassWordClick = () => {
        Modal.confirm({
            title: "是否修改密码？",
            okText: "是",
            cancelText: "否",
            onOk: () => {
                if (authStore.userInfo.USER_ACCOUNT === "admin") {
                    alert("管理员密码不能修改!");
                    return;
                }
                this.passwordRef.current.data = authStore.userInfo;
                this.passwordRef.current.show();
            }
        });
    };

    render() {
        let {userInfo} = toJS(authStore);

        return (
            <div className={styles.container}>
                <Header
                    title={htmlStore.projectName}
                    version={htmlStore.version}
                    userName={userInfo.USER_NAME}
                    data={this.routeData}
                    onChangPasswordClick={this.onChangPassWordClick}
                    onLoginOutClick={this.onLoginOutClick}
                />
                <div className={styles.contentContainer}>
                    {
                        this.routeData.length > 0 &&
                        <NavRouteContent
                            childRouteData={this.routeData}
                            defaultRouteIndex={0}
                        />
                    }
                </div>
            </div>
        );
    }
}
