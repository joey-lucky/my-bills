import {observer} from "mobx-react";
import React, {Component} from "react";
import {NavLink, Redirect, Route, Switch, withRouter} from "react-router-dom";
import routes from "./routes";
import {Flex} from "antd-mobile";
import {observable} from "mobx";
import * as styles from "./App.css";
import {globalStyles} from "@global";

export default class App extends Component {

    render() {
        const {match} = this.props;
        const firstRoutePath = match.path + routes[0].path + routes[0].children[0].path;
        return (
            <Flex
                style={globalStyles.container}
                direction={"column"}
            >
                <TabBar/>
                <Flex.Item style={{width: "100%"}}>
                    <Switch>
                        {
                            routes.reduce((pre, curr) => {
                                let parentPath = match.path + curr.path;
                                curr.children.forEach((item) => {
                                    pre.push(
                                        <Route
                                            key={parentPath + item.path}
                                            path={parentPath + item.path}
                                            component={item.component}/>
                                    );
                                });
                                return pre;
                            }, [])
                        }
                        <Redirect to={firstRoutePath}/>
                    </Switch>
                </Flex.Item>
            </Flex>
        )
    }
}

@withRouter
@observer
class TabBar extends Component {
    @observable selectIndex = 0;

    render() {
        const {match} = this.props;
        return (
            <Flex
                className={styles.topBar}
                justify={"around"}
                direction={"row"}>
                {
                    routes.map((item) =>
                        <NavLink
                            className={styles.tab}
                            key={match.path + item.path}
                            activeClassName={styles.activeTab}
                            to={match.path + item.path + item.children[0].path}>
                            {item.name}
                        </NavLink>
                    )
                }
            </Flex>
        );
    }
}
