import React from "react";
import * as PropTypes from "prop-types";
import {Icon} from "antd";

/**
 * 仅支持表单
 */
export default class Upload extends React.Component {
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func,
        listType: PropTypes.string,
    };

    renderTextItem(item, index) {
        return (
            <div
                style={styles.textContent}
                key={item.url}
            >
                <Icon type="paper-clip"/>
                <a target={"_blank"}
                   style={styles.text}
                   href={item.url}
                >
                    {item.name}
                </a>
            </div>
        );
    }

    renderImageItem(item, index) {
        return (
            <div style={styles.imgContent}>
                <img
                    key={item.url}
                    style={styles.img}
                    src={item.url || ""}
                    onClick={() => {
                        window.open(item.url)
                    }}
                />
            </div>
        );
    }


    render() {
        const {value = {}, listType} = this.props;
        const {fileList = []} = value;
        if (listType === "text") {
            return (
                <div style={styles.textContainer}>
                    {
                        fileList.map(this.renderTextItem)
                    }
                </div>
            );
        } else {
            return (
                <div style={styles.imgContainer}>
                    {
                        fileList.map(this.renderImageItem)
                    }
                </div>
            );
        }
    }
}

const styles = {
    imgContainer:{
        display:"flex",
        flexDirection:"row",
        width:"100%",
        boxSizing:"border-box",
        position: "relative",
    },
    imgContent: {
        width: 116,
        height: 116,
        padding: 12,
        position: "relative",
        boxSizing:"border-box",
    },
    img: {
        width: "100%",
        height: "100%"
    },
    textContainer:{
        display:"flex",
        flexDirection:"column",
        width:"100%",
        boxSizing:"border-box",
        position: "relative",
    },
    textContent: {
        width: "100%",
        fontSize: "14px",
    },
    text:{
        marginLeft:"12px",
        color:"#0099CC"
    },


};
