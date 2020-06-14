import React from "react";
import {Redirect, Route, Router} from "react-router-dom";
import {LocaleProvider, Toast} from "antd-mobile";
import routes from "./routes";
import {createHashHistory} from "history";
import {setErrorHandler} from "@utils/request";
import {Switch} from "@components/routes";
import * as styles from "./App.css";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {authStore} from "./stores";
import GlobalComponent from "./GlobalComponent";

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
        setErrorHandler((status) => {
            if (status === 401) {
                history.replace("/login");
            }
        });
    }

    componentDidMount() {

    }

    render() {
        Toast.SHORT = 1;
        return (
            <LocaleProvider>
                <Router history={history}>
                    <div className={styles.container}>
                        <GlobalComponent/>
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
                    </div>
                </Router>
            </LocaleProvider>
        );
    }
}
