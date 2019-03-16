import React from "react";
import {Flex} from "antd-mobile";
import {Redirect, Route, Switch} from "react-router-dom";
import {globalStyles} from "@global";
import BillTypeAdd from "./BillTypeAdd";
import CardAdd from "./CardAdd";
import CardTypeAdd from "./CardTypeAdd";
import MonthStatDetail from "./MonthStatDetail";
import CreditBillAdd from "./CreditBillAdd";
import NormalBillAdd from "./NormalBillAdd";

const routes = [
    {path: "/normal-bill-add", component: NormalBillAdd},
    {path: "/credit_bill-add", component: CreditBillAdd},
    {path: "/bill-type-add", component: BillTypeAdd},
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
