import * as React from "react";
import {Flex, Icon, List, NavBar} from "antd-mobile";

export default class SettingList extends React.Component {
    render() {
        return (
            <Flex
                style={{height: "100%"}}
                direction={"column"}
                align={"center"}>
                <NavBar
                    style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => this.props.history.goBack()}
                >设置列表</NavBar>
                <List style={{width: "100%"}}>
                    <List.Item
                        arrow={"horizontal"}
                        onClick={() => this.historyPush("/bill-type-list")}
                    >
                        账单类型
                    </List.Item>
                    <List.Item
                        arrow={"horizontal"}
                        onClick={() => this.historyPush("/card-type-list")}
                    >
                        银行卡类型
                    </List.Item>
                    <List.Item
                        arrow={"horizontal"}
                        onClick={() => this.historyPush("/card-list")}
                    >
                        银行卡
                    </List.Item>
                </List>
            </Flex>
        )
    }

    historyPush = (url) => {
        let {match} = this.props;
        let path = match.path.replace(/(.*)(\/[a-z-]+)/, '$1' + url);
        this.props.history.push(path);
    };
}
