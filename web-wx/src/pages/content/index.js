import React, {createContext} from "react";
import ReactDOM from "react-dom";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {observer} from "mobx-react";
import {createBrowserHistory} from "history";
import {publicPath} from "@global";
import {screenState} from "@utils/ScreenState";
import * as api from "@services/api";
import request from '@utils/request';

import {LocaleProvider} from "antd-mobile";
import "./theme.less";
import routes from "./routes";
import * as PropTypes from "prop-types";

const zhCN = require("antd/lib/locale-provider/zh_CN");

export const TestContext = createContext("aaa");

@observer
class App extends React.Component {
    static childContextTypes = {
        api: PropTypes.any,
        request: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
    }

    getChildContext() {
        return {
            api, request
        }
    }

    render() {
        let path = this.props.match.path;
        return (
            <TestContext.Provider value={"ces"}>
                <div style={{height: screenState.clientHeight, width: screenState.clientWidth}}>
                    <Switch>
                        {
                            routes.map((item) =>
                                <Route
                                    path={path + item.path}
                                    component={item.component}/>
                            )
                        }
                        <Redirect to={path + routes[0].path}/>
                    </Switch>
                </div>
            </TestContext.Provider>

        )
    }
}

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

