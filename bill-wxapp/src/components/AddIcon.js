import * as React from "react";
import addIcon from "./ic_add.png";
import * as PropTypes from "prop-types";

export default class AddIcon extends React.Component{
    static propTypes = {
        onAddClick: PropTypes.any,
    };

    render(){
        return (
            <div style={{position: "absolute", bottom: "3rem", right: "1rem", zIndex: 99}}
                 onClick={this.props.onAddClick}
            >
                <img style={{width: "3rem",}}
                     src={addIcon}/>
            </div>
        );
    }
}