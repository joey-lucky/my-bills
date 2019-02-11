import React from "react";
import ReactDOM from "react-dom";
import {Route, Router, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";
import {publicPath} from "@global";
import {LocaleProvider} from "antd-mobile";
import App from "./App";
import "./theme.less";
const zhCN = require("antd/lib/locale-provider/zh_CN");
let browserHistory = createBrowserHistory({
    forceRefresh:false,
    basename: publicPath
});

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Router history={browserHistory}>
            <Switch>
                <Route
                    path={"/content"}
                    component={App}/>
            </Switch>
        </Router>
    </LocaleProvider>,
    document.getElementById("root")
);

