import React, {Component} from "react";
import {createBrowserHistory} from "history";
import LoginPage from "./page/LoginPage/LoginPage";

const basename = "/react/demo";
const browserHistory = createBrowserHistory({basename: basename});
export default class App extends Component {
    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <LoginPage />
            </div>
        );
    }
}


