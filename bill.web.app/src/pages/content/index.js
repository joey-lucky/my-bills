import React from "react";
import ReactDOM from "react-dom";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";
import {publicPath} from "@global";
import {LocaleProvider} from "antd-mobile";
import App from "./App";
import "./theme.less";

let browserHistory = createBrowserHistory({
    forceRefresh:false,
    hashType:"hashbang",
    basename: publicPath
});

ReactDOM.render(
    <LocaleProvider >
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

