import {LocaleProvider} from "antd";
import React from "react";
import ReactDOM from "react-dom";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {observer} from "mobx-react";
import {createBrowserHistory} from "history";
import {publicPath} from "@global";
import {screenState} from "@utils/ScreenState";
import "./theme.less";
import HomePage from "./HomePage";

const zhCN = require("antd/lib/locale-provider/zh_CN");

let App = observer(() => {
    return (
        <LocaleProvider locale={zhCN}>
            <Router history={createBrowserHistory({basename: publicPath})}>
                <div style={{height: screenState.clientHeight, width: screenState.clientWidth}}>
                    <Switch>
                        <Route
                            path={"/home"}
                            component={HomePage}/>
                        <Redirect to="/home"/>
                    </Switch>
                </div>
            </Router>
        </LocaleProvider>
    )
});

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);

