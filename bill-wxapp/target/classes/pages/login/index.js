import React from "react";
import ReactDOM from "react-dom";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {observer} from "mobx-react";
import {createBrowserHistory} from "history";
import {publicPath} from "@global";
import {screenState} from "@utils/ScreenState";
import LoginPage from "./loginpage/LoginPage";
import "./theme.less";

const App = observer(() => {
    return (
        <Router history={createBrowserHistory({basename: publicPath})}>
            <div style={{height: screenState.clientHeight, width: "100%"}}>
                <Switch>
                    <Route
                        path={"/login"}
                        component={LoginPage}/>
                </Switch>
            </div>
        </Router>
    );
});

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);

