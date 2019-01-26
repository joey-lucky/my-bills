import {observer} from "mobx-react";
import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import routes from "./routes";

@observer
export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let path = this.props.match.path;
        return (
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
        )
    }
}
