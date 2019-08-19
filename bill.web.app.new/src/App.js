import React from "react";
import {Redirect, Route, Router} from "react-router-dom";
import {Flex, LocaleProvider, Toast} from "antd-mobile";
// import {publicPath} from "./global";
import routes from "./routes";
import {createHashHistory} from "history";
import {setErrorHander} from "@utils/request";
import {Switch} from "@components/routes";
import * as styles from "./App.css";
import * as globalStyles from "./globalStyles.css";
import {observer} from "mobx-react";
import {observable} from "mobx";

let history = createHashHistory({
    // forceRefresh:false,
    // hashType:"hashbang",
    basename: "/"
});

function fullScreen() {
    let ele = document.body;
    if (ele.requestFullscreen) {
        ele.requestFullscreen().catch((error) => {
            console.log(error)
        });
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    }
}

@observer
export default class App extends React.Component {
    @observable hideGoFullScreen = false;

    constructor(props, context) {
        super(props, context);
        setErrorHander((e) => {
            if (e.message.indexOf("token") !== -1) {
                history.push("/login");
            }
        });
    }

    render() {
        Toast.SHORT = 1;
        return (
            <LocaleProvider>
                <Router history={history}>
                    <div className={styles.container}>
                        <div className={styles.contentContainer}>
                            <Switch>
                                {
                                    routes.map(item =>
                                        <Route
                                            key={item.path}
                                            path={item.path}
                                            component={item.component}
                                        />
                                    )
                                }
                                <Redirect to={"/home"}/>
                            </Switch>
                        </div>
                        {/*<Flex*/}
                            {/*onClick={() => {*/}
                                {/*this.hideGoFullScreen = true;*/}
                                {/*fullScreen();*/}
                            {/*}}*/}
                            {/*className={`${styles.fullScreenContainer} ${this.hideGoFullScreen && globalStyles.hide}`}*/}
                            {/*justify={"center"}*/}
                            {/*align={"center"}*/}
                        {/*>*/}
                            {/*<div className={styles.goFullScreen}>*/}
                                {/*进入全屏*/}
                            {/*</div>*/}
                        {/*</Flex>*/}
                    </div>
                </Router>
            </LocaleProvider>
        );
    }
}
