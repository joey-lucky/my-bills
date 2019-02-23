import React from "react";
import {Flex, Icon, NavBar} from "antd-mobile";
import {globalStyles} from "@global";
import BillAdd from "./BillAdd";
import BillTypeAdd from "./BillTypeAdd";
import CardAdd from "./CardAdd";
import CardTypeAdd from "./CardTypeAdd";

const pages = {
    "bill-add": BillAdd,
    "bill-type-add": BillTypeAdd,
    "card-add": CardAdd,
    "card-type-add": CardTypeAdd,
};

export default class NavBarContent extends React.Component {
    static getDerivedStateFromProps(nextProps, preState) {
        let stateStr = nextProps.routeParams.state;
        console.log(stateStr);
    }

    onBackClick=()=>{
        let {history} = this.props;
        history.push("/app-bar",{index:[0,0,0],})
    };

    render() {
        const {pageKey, id} = this.state;
        let Comp = pages[pageKey] || BillAdd;
        return (
            <Flex style={globalStyles.container}
                  direction={"column"}
            >
                <NavBar style={{width: "100%"}}
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={this.onBackClick}
                >账单新增</NavBar>
                <Flex.Item style={{width: "100%"}}>
                    <Comp id={id}/>
                </Flex.Item>
            </Flex>
        );
    }
}
