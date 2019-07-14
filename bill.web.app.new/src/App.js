import React from "react";
import {Route, Router} from "react-router-dom";
import {LocaleProvider, Toast} from "antd-mobile";
import {createBrowserHistory} from "history";
import {publicPath} from "./global";
import routes from "./routes";


let browserHistory = createBrowserHistory({
    forceRefresh:false,
    hashType:"hashbang",
    basename: publicPath
});
export default class App extends React.Component {
    render() {
        Toast.SHORT = 1;
        const {match} = this.props;
        return (
            <LocaleProvider >
                <Router history={browserHistory}>
                    <div style={styles.container}>
                        {
                            routes.map(item=>
                                <Route
                                    key={item.path}
                                    path={item.path}
                                    component={item.component}
                                />
                            )
                        }
                    </div>
                </Router>
            </LocaleProvider>

        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        position: "relative"
    }
};