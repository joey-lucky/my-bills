import React from "react";


export function Flex(props) {
    let {style={},children,...otherProps} = props;
    style = {
        display:"flex",
        width:"100%",
        height:"100%",
        flexShrink:"0"
    }
    return (
        <div
            style={style}
            {...otherProps}>
            {
                children
            }
        </div>
    );
}