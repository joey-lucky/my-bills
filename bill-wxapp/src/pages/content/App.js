import {observer} from "mobx-react";
import React, {Component} from "react";
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import routes from "./routes";
import {screenState} from "@utils/ScreenState";
import {Flex, WhiteSpace} from "antd-mobile";
import {observable} from "mobx";

const getContent = (routeData = []) => ({match}) => {
    return (
        <Switch>
            {
                routeData.map((item) =>
                    <Route
                        key={match.path + item.path}
                        path={match.path + item.path}
                        component={item.component}/>
                )
            }
            <Redirect to={match.path + routeData[0].path}/>
        </Switch>
    );
};


@observer
export default class App extends Component {
    @observable selectIndex = 0;

    render() {
        const {match} = this.props;
        return (
            <Flex
                direction={"column"}
                style={{height: screenState.clientHeight, width: screenState.clientWidth}}>
                <Flex.Item style={{width:"100%"}}>
                    <Switch>
                        {
                            routes.map((item) =>
                                <Route
                                    key={match.path + item.path}
                                    path={match.path + item.path}
                                    component={getContent(item.children)}/>
                            )
                        }
                        <Redirect to={match.path + routes[0].path}/>
                    </Switch>
                </Flex.Item>
                <Flex
                    style={{width: "100%",backgroundColor:"white"}}
                    justify={"around"}
                    direction={"row"}>
                    {
                        routes.map((item) =>
                            <NavLink
                                key={match.path + item.path}
                                style={{color: "rgba(0,0,0,.65)",padding:"0.5rem"}}
                                activeStyle={{color: "#1890ff",padding:"0.5rem"}}
                                to={match.path + item.path}>
                                <Flex direction={"column"}>
                                    <img
                                        style={{width:"1.5rem"}}
                                        src="https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg"/>
                                    <WhiteSpace size={"xs"}/>
                                    <h6>{item.name}</h6>
                                </Flex>
                            </NavLink>
                        )
                    }
                </Flex>
            </Flex>
        )
    }
}
