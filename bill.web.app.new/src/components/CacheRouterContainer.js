import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import {withRouter} from "react-router-dom";

@withRouter
export default class CacheRouterContainer extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        onClick: PropTypes.func,
        direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
        justify: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
        align: PropTypes.oneOf(['start', 'center', 'end', 'baseline', 'stretch']),
    };

    constructor(props) {
        super(props);
        let path = props.match.path;
        this.state = {
            zIndex: 10 + path.split("/").length
        };
    }

    render() {
        let {style={},...props} = this.props;
        return (
            <Flex
                {...props}
                style={{...styles.container,...style,zIndex:this.state.zIndex}}
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
    }
};