import React, {Component} from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {browserHistory} from "./global";
import LoginPage from "./page/LoginPage";
import HomePage from "./page/HomePage";

export default class App extends Component {
    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <Router history={browserHistory}>
                    <Switch>
                        <Route
                            key={"/login"}
                            path={"/login"}
                            component={LoginPage}
                        />
                        <Route
                            key={"/home"}
                            path={"/home"}
                            component={HomePage}
                        />
                        <Redirect to={"/login"}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}


