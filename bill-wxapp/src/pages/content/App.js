import {observer} from "mobx-react";
import React, {Component} from "react";
import {NavLink, Redirect, Route, Switch, withRouter} from "react-router-dom";
import routes from "./routes";
import {Flex, WhiteSpace} from "antd-mobile";
import {observable} from "mobx";
import OptimizeUtils from "@utils/OptimizeUtils";

export default class App extends Component {

    render() {
        const {match} = this.props;
        return (
            <Flex
                direction={"column"}
                style={{
                    height:"100%",
                    width: "100%",
                    backgroundColor: "rgba(0.0,0,0,0.02)",
                }}>
                <Flex.Item style={{width: "100%"}}>
                    <Switch>
                        {
                            routes.map((item) =>
                                <Route
                                    key={match.path + item.path}
                                    path={match.path + item.path}
                                    component={(props) => {
                                        let Comp = item.component;
                                        return (
                                            <Comp
                                                {...props}
                                                childRouteData={item.children}
                                            />
                                        );
                                    }}/>
                            )
                        }
                        <Redirect to={match.path + routes[0].path}/>
                    </Switch>
                </Flex.Item>
                <TabBar/>
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
                style={{width: "100%", backgroundColor: "white"}}
                justify={"around"}
                direction={"row"}>
                {
                    routes.map((item) =>
                        <NavLink
                            key={match.path + item.path}
                            style={{color: "rgba(0,0,0,0.65)", padding: "0.5rem"}}
                            activeStyle={{color: "#1890ff", padding: "0.5rem"}}
                            to={match.path + item.path}>
                            <Flex direction={"column"}>
                                <img
                                    style={{width: "1.5rem",height:"1.5rem"}}
                                    src="https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg"/>
                                <WhiteSpace size={"xs"}/>
                                <h6>{item.name}</h6>
                            </Flex>
                        </NavLink>
                    )
                }
            </Flex>
        );
    }
}
