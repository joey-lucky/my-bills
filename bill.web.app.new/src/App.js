import React from "react";
import {Router} from "react-router-dom";
import {LocaleProvider} from "antd-mobile";
import {createBrowserHistory} from "history";
import {publicPath} from "./global";
import RouteContent from "@components/routes/RouteContent";
import routes from "./routes";


let browserHistory = createBrowserHistory({
    forceRefresh:false,
    hashType:"hashbang",
    basename: publicPath
});
export default class App extends React.Component {
    render() {
        const {match} = this.props;
        return (
            <LocaleProvider >
                <Router history={browserHistory}>
                    <div style={{width:"100%",height:"100%",backgroundColor:"white"}}>
                        <RouteContent childRouteData={routes}/>
                    </div>
                </Router>
            </LocaleProvider>

        );
    }
}
