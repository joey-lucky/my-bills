import {LocaleProvider} from "antd";
import React from "react";
import ReactDOM from "react-dom";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {observer} from "mobx-react";
import {createBrowserHistory} from "history";
import {publicPath} from "@global";
import {screenState} from "@utils/ScreenState";
import "./theme.less";
import routes from "./routes";

const zhCN = require("antd/lib/locale-provider/zh_CN");
let App = observer((props) => {
    return (
        <div style={{height: screenState.clientHeight, width: screenState.clientWidth}}>
            <Switch>
                {
                    routes.map((item) =>
                        <Route
                            path={props.match.path + item.path}
                            component={item.component}/>
                    )
                }
                <Redirect to={props.match.path + routes[0].path}/>
            </Switch>
        </div>
    )
});

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Router history={createBrowserHistory({basename: publicPath})}>
            <Switch>
                <Route
                    path={"/content"}
                    component={App}/>
                <Redirect to={"/content"}/>
            </Switch>
        </Router>
    </LocaleProvider>,
    document.getElementById("root")
);

