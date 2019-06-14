import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppBarContent from "./AppBarContent";
import NavBarContent from "./NavBarContent";

export default class App extends React.Component {
    render() {
        const {match} = this.props;
        return (
            <Switch>
                <Route
                    path={match.path + "/app-bar"}
                    component={AppBarContent}/>
                <Route
                    path={match.path + "/nav-bar"}
                    component={NavBarContent}/>
                <Redirect to={match.path + "/app-bar"}/>
            </Switch>
        );
    }
}
