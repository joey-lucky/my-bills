import * as React from "react";
import {Flex} from "antd-mobile";
import FontIcon from "@components/FontIcon";
import * as PropTypes from "prop-types";

export default class BottomIcon extends React.Component{
    static propTypes = {
        title: PropTypes.func,
        unicode: PropTypes.string,
    };

    render(){
        return(
            <Flex
                style={{width:"1.5rem",color:'#302F2D'}}
                direction={"column"}>
                <FontIcon
                    style={{fontSize:"0.57rem"}}
                    unicode={this.props.unicode}/>
                <Flex>{this.props.title}</Flex>
            </Flex>
        );
    }


}