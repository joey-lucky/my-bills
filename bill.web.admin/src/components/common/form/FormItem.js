import * as React from "react";
import PropTypes from "prop-types";

export default class FormItem extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        label: PropTypes.node,
        children: PropTypes.object,
        colon: PropTypes.bool,
    };

    render() {
        let {children, style = {}, colon = true, label = ""} = this.props;
        style = {...styles.container, ...style};
        return (
            <div
                style={style}
            >
                <div style={styles.title}>
                    {label}
                    {
                        colon && "："
                    }
                </div>
                <div style={styles.content}>
                    {children}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        display: "flex",
        width: "100%",
        height: "40px",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {},
    content: {
        width: "0px",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
};
