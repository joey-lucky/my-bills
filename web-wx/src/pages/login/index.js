import React from "react";
import ReactDOM from "react-dom";
import {Redirect, Route, Router} from "react-router-dom";
import { publicPath} from "@global";
import {screenState} from "@utils/ScreenState";
import {observer} from "mobx-react";
import LoginPage from "./loginpage/LoginPage";
import "./theme.less";
import {Switch} from "react-router-dom";
import {createBrowserHistory} from "history";

const App = observer(() => {
    return (
        <Router history={createBrowserHistory({basename: publicPath})}>
            <div style={{height: screenState.clientHeight, width: "100%"}}>
                <Switch>
                    <Route
                        path={"/login"}
                        component={LoginPage}/>
                    <Redirect to="/login"/>
                </Switch>
            </div>
        </Router>
    );
});

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);

