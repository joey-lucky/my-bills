import {Layout} from "antd";
import React, {Component} from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {createBrowserHistory} from "history";
import BasicList from "./basiclist/BasicList";
import FormList from "./formlist/FormList";
import FilterList from "./filterlist/FilterList";
import PageList from "./pagelist/PageList";
import MapDemo from "./mapdemo/MapDemo";
import DemoManager from "./demo/DemoManager";

const basename = "/react/demo";
const browserHistory = createBrowserHistory({basename: basename});
export default class App extends Component {
    render() {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <Router history={browserHistory}>
                    <Switch>
                        <Route
                            path="/function-list" component={() => {
                                return (
                                    <Layout>
                                        <h1>模板列表</h1>
                                        <ul>
                                            <li><a href={basename + "/basic-list"} target="_blank">基础列表</a></li>
                                            <li><a href={basename + "/form-list"} target="_blank">表单列表</a></li>
                                            <li><a href={basename + "/filter-list"} target="_blank">带筛选列表</a></li>
                                            <li><a href={basename + "/page-list"} target="_blank">带分页列表</a></li>
                                            <li><a href={basename + "/map-demo"} target="_blank">地图示例</a></li>
                                            <li><a href={basename + "/demo-page"} target="_blank">演示界面</a></li>
                                        </ul>
                                    </Layout>
                                );
                            }}
                        />
                        <Route path="/basic-list" component={BasicList}/>
                        <Route path="/form-list" component={FormList}/>
                        <Route path="/filter-list" component={FilterList}/>
                        <Route path="/page-list" component={PageList}/>
                        <Route path="/map-demo" component={MapDemo}/>
                        <Route path="/demo-page" component={DemoManager}/>
                        <Redirect to="/function-list"/>
                    </Switch>
                </Router>
            </div>
        );
    }
}


