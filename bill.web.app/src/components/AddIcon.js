import * as React from "react";
import addIcon from "./ic_add.png";
import * as PropTypes from "prop-types";

export default class AddIcon extends React.Component{
    static propTypes = {
        onClick: PropTypes.func,
    };

    render(){
        return (
            <div style={{position: "absolute", bottom: "5rem", right: "1rem", zIndex: 99}}
                 onClick={this.props.onClick}
            >
                <img style={{width: "3rem",}}
                     src={addIcon}/>
            </div>
        );
    }
}