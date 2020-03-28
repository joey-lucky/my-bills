import * as React from "react";
import * as PropTypes from "prop-types";


export default class Input extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
    };


    render() {
        return (
            <span style={{height: 32, padding: "0px 11px", lineHeight: "32px"}}>
                {
                    this.props.value ||
                    <span style={{color:"#999999"}}>
                    {
                        this.props.placeholder||""
                    }
                 </span>

                }

            </span>
        );
    }

}
