import {observer} from "mobx-react";
import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import routes from "./routes";
import {screenState} from "@utils/ScreenState";
import {Flex,TabBar} from "antd-mobile";
import styles from "./App.css";

@observer
export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let path = this.props.match.path;
        return (
            <div
                style={{height: screenState.clientHeight, width: screenState.clientWidth}}>
                <TabBar
                    className={styles.topBar}
                    unselectedTintColor="#949494"
                    tintColor="#33A3F4"
                    barTintColor="white"
                    hidden={false}
                    tabBarPosition={"bottom"}
                >
                    <TabBar.Item
                        title="账单数据"
                        key="bill-data"
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat'
                        }}
                        />
                        }
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat'
                        }}
                        />
                        }
                        selected={true}
                        badge={1}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'blueTab',
                            });
                        }}
                        data-seed="logId"
                    >
                        <Switch>
                            {
                                routes[0].map((item) =>
                                    <Route
                                        path={path + item.path}
                                        component={item.component}/>
                                )
                            }
                            <Redirect to={path + routes[0].path}/>
                        </Switch>
                    </TabBar.Item>
                </TabBar>
            </div>
        )
    }
}
