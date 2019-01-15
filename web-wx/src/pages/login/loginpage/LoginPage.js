import * as React from "react";
import {publicPath} from "@global";
import {observable} from "mobx";
import {observer} from "mobx-react";
import OptimizeUtils from "../../../utils/OptimizeUtils";
import {Button, Card, Flex, InputItem, List} from "antd-mobile";
import {createForm} from 'rc-form';
import {queryLogin} from "@services/api";

class AppState {
    @observable userName = "";
    @observable password = "";
    defNextUrl = publicPath + "/content/";

    asyncLogin(params) {
        return queryLogin(params).then(() => {
            window.location.href = this.defNextUrl;
        });
    }
}

@createForm()
@observer
export default class LoginPage extends React.Component {
    _appState = new AppState();

    componentDidMount() {
        OptimizeUtils.prefetchHtmlAndSource(publicPath + "/home/");
    }

    onLoginClick = (e) => {
        e.preventDefault();
        let values = this.props.form.getFieldsValue();
        this._appState.asyncLogin(values);
    };

    render() {
        const {form} = this.props;
        return (
            <Flex
                style={{height: "100%",backgroundColor:"rgba(0,0,0,0.1)"}}
                direction={"column"}
                justify={"center"}
                align={"center"}>

                <Card full={false} style={{width:"90%"}}>
                    <Card.Header title={"账单管理"}/>
                    <Card.Body>
                        <List>
                            <InputItem
                                {...form.getFieldProps("userName")}
                                type={"text"}
                                defaultValue={""}
                                placeholder="start from left"
                                moneyKeyboardAlign="left"
                            >账号</InputItem>
                            <InputItem
                                {...form.getFieldProps("password")}
                                type={"password"}
                                defaultValue={""}
                                placeholder="start from left"
                                moneyKeyboardAlign="left"
                            >密码</InputItem>
                            <Button
                                onClick={this.onLoginClick}
                                type={"primary"}>登录</Button>
                        </List>
                    </Card.Body>
                </Card>
            </Flex>
        )
    }
}
