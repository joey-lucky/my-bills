import React from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

export default class CommonLayout extends React.Component {
    render() {
        const {childRouteData,match} = this.props;
        return (
            <Switch>
                {
                    childRouteData.map((item) =>
                        <Route
                            key={match.path + item.path}
                            path={match.path + item.path}
                            component={item.component}/>
                    )
                }
                <Redirect to={match.path + childRouteData[0].path}/>
            </Switch>
        );
    }
}
