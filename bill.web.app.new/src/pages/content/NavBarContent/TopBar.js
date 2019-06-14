import * as React from "react";
import {withRouter} from "react-router-dom";
import * as PropTypes from "prop-types";
import {Icon, NavBar} from "antd-mobile";

@withRouter
export default class TopBar extends React.Component{
    static propTypes = {
        title: PropTypes.any,
    };

    onBackClick = () => {
        let {history} = this.props;
        history.push("/content/app-bar")
    };

    render(){
        return (
            <NavBar style={{width: "100%"}}
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={this.onBackClick}
            >{this.props.title}</NavBar>
        );
    }
}