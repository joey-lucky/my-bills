import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";

export default class CacheRouterContainer extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        onClick: PropTypes.func,
        direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
        justify: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
        align: PropTypes.oneOf(['start', 'center', 'end', 'baseline', 'stretch']),
    };


    render() {
        let {style={},...props} = this.props;
        return (
            <Flex
                {...props}
                style={{...styles.container,...style}}
            >
                {
                    this.props.children
                }
            </Flex>
        )
    }
}

const styles = {
    container: {
        position:"absolute",
        backgroundColor:"white",
        top:0,
        left:0,
        zIndex:10
    }
};