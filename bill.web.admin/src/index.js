import * as React from "react";
import ReactDOM from "react-dom";
import {ConfigProvider, Spin} from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import {observer} from "mobx-react";
import {createBrowserHistory} from "history";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {screenState} from "@utils/ScreenState";
import {getPublicPath, initConfig} from "@global";
import {toJS} from "mobx";
import routes from "./routes";
import "./theme.less";

initConfig({
    apiPath: "/bill/api",
    publicPath: "/bill/admin",
    filePath:"/file"
});

const history = createBrowserHistory({basename: getPublicPath()});

@observer
class App extends React.Component {
    render() {
        let {clientHeight, clientWidth} = toJS(screenState);
        return (
            <Router history={history}>
                    <div style={{height: clientHeight, width: clientWidth}}>
                        <Switch>
                            {
                                routes.map(item =>
                                    <Route
                                        key={item.path}
                                        path={item.path}
                                        component={(props) => {
                                            let Comp = item.component;
                                            return <Comp {...props} childRouteData={item.children}/>;
                                        }}
                                    />
                                )
                            }
                            <Redirect to={"/home"}/>
                        </Switch>
                    </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <ConfigProvider
        locale={zhCN}
        form={{
            validateMessages: {
                required: "必选字段",
            }
        }}
    >
        <App/>
    </ConfigProvider>
    , document.getElementById("root"));
