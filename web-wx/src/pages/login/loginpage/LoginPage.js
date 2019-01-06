import * as React from "react";
import * as styles from "./LoginPage.css";
import {publicPath} from "@global";
import {Ajax} from "@utils/ajax";
import {observable} from "mobx";
import {observer} from "mobx-react";
import OptimizeUtils from "../../../utils/OptimizeUtils";

class AppState {
    @observable userName = "";
    @observable password = "";
    defNextUrl = publicPath + "/home/";


    asyncLogin() {
        let url = this._getQueryVariable("url");
        let params = {username: this.userName, password: this.password, url: url};
        Ajax.apiPost("/safe/login", params)
            .then((result) => {
                let resultFlag = result["result_flag"];
                if (resultFlag === "ERROR") {
                    alert(resultFlag);
                } else if (result.data && result.data[0].url) {
                    window.location.href = publicPath + result.data[0].url;
                } else {
                    window.location.href = this.defNextUrl;
                }
            });
    }

    _getQueryVariable(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return null;
    }
}

@observer
export default class LoginPage extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        OptimizeUtils.prefetchHtmlAndSource(publicPath + "/home/");
    }

    onLoginClick = () => {
        this._appState.asyncLogin();
    };

    onKeyDown = (event) => {
        if (event.keyCode === 13) {
            this._appState.asyncLogin();
        }
    };

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.logo}>在线监测运营平台</div>
                    <div className={styles.form}>
                        <div className={styles.formBox}>
                            <div className={styles.cell}>
                                <div className={styles.bg}>
                                    <label className={styles.user}>用户名</label>
                                    <input
                                        defaultValue={this._appState.userName}
                                        onKeyDown={this.onKeyDown}
                                        onChange={(event) => this._appState.userName = event.target.value}
                                        type="text"
                                        name="username"
                                        className={styles.input}/>
                                </div>
                                <div className={styles.bg}>
                                    <label className={styles.pwd}>密码</label>
                                    <input
                                        defaultValue={this._appState.password}
                                        onKeyDown={this.onKeyDown}
                                        onChange={(event) => this._appState.password = event.target.value}
                                        type="password"
                                        name="password"
                                        className={styles.input}/>
                                </div>
                            </div>
                            <div className={styles.cell}>
                                <input
                                    onClick={this.onLoginClick}
                                    className={styles.btn}
                                    value="登录"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
