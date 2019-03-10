import React from "react";
import {Flex} from "antd-mobile";
import {Redirect, Route, Switch} from "react-router-dom";
import {globalStyles} from "@global";
import BillAdd from "./BillAdd";
import BillTypeAdd from "./BillTypeAdd";
import CardAdd from "./CardAdd";
import CardTypeAdd from "./CardTypeAdd";
import MonthStatDetail from "./MonthStatDetail";

const routes = [
    {path: "/bill-add/:id", component: BillAdd},
    {path: "/bill-type-add/:id", component: BillTypeAdd},
    {path: "/card-add/:id", component: CardAdd},
    {path: "/card-type-add/:id", component: CardTypeAdd},
    {path: "/month-stat-detail", component: MonthStatDetail},
];

export default class NavBarContent extends React.Component {
    render() {
        const {match} = this.props;
        return (
            <Flex style={globalStyles.container}>
                <Switch>
                    {
                        routes.map(item =>
                            <Route
                                key={match.path + item.path}
                                path={match.path + item.path}
                                component={item.component}/>
                        )
                    }
                    <Redirect to={match.path + routes[0].path}/>
                </Switch>
            </Flex>
        );
    }
}
