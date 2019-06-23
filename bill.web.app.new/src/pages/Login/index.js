import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import icLogin from "./ic_login.png";
import {Divider} from "@components/Divider";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";
import {createForm} from 'rc-form';
import {safeController} from "../../services/api";
import {setToken} from "@utils/request";

@createForm()
export default class Login extends React.Component {
    onLoginClick = (e) => {
        e.preventDefault();
        let values = this.props.form.getFieldsValue();
        this.asyncLogin(values);
    };

    asyncLogin = (params) => {
        return safeController.login(params)
            .then((d) => {
                setToken(d.data[0].token);
                let pathname = this.props.location.pathname;
                let parentPath = pathname.replace(/[^/]+$/, "");
                this.props.history.push(parentPath + "home");
            });
    };

    render() {
        return (
            <Flex
                style={{width: "100%", height: "100%"}}
                direction={"column"}
            >
                <ToolBar
                    title={"登录"}
                />

                <img style={styles.iconContainer} src={icLogin}/>
                <Divider direction={"row"} size={"1px"}/>
                <Flex
                    style={styles.inputContainer}
                    direction={"row"}
                    align={"center"}
                >
                    <FontIcon
                        style={styles.inputIcon}
                        unicode={icons.user}/>

                    <input
                        {...this.props.form.getFieldProps("userName")}
                        style={styles.input}
                        placeholder={"请输入账号"}
                    />
                </Flex>
                <Flex
                    style={styles.inputContainer}
                    direction={"row"}
                    align={"center"}
                >
                    <FontIcon
                        style={styles.inputIcon}
                        unicode={icons.password}/>

                    <input
                        {...this.props.form.getFieldProps("password")}
                        style={styles.input}
                        placeholder={"请输入账号"}
                    />
                </Flex>
                <Flex
                    style={styles.loginContainer}
                    align={"center"}
                    justify={"center"}
                    onClick={this.onLoginClick}
                >
                    登录
                </Flex>
            </Flex>
        );

    }
}

const styles = {
    iconContainer: {
        marginTop: "0.45rem",
        marginBottom: "1.1rem",
        height: "1.5rem",
    },
    inputContainer: {
        height: "1.5rem",
        width: "100%",
    },
    inputIcon: {
        fontSize: fontSizes.appBar,
        marginLeft: "0.5rem",
        marginRight: "0.1rem",
        color: "#BBBBBB"
    },
    input: {
        paddingLeft: "0.12rem",
        height: "100%",
        width: 0,
        flex: 1,
        background: "none",
        borderTop: "none",
        borderRight: "none",
        borderLeft: "none",
        borderBottom: "1px solid divider",
        fontSize: fontSizes.text,
        color: colors.text
    },
    loginContainer: {
        marginTop: "0.2rem",
        width: "80%",
        height: "1.3rem",
        backgroundColor: "#FBC473",
        color: "white",
        fontSize: fontSizes.appBar
    }
};