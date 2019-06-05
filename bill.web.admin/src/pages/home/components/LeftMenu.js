import RouteMenu from "@components/routes/RouteMenu";
import * as React from "react";
import * as PropTypes from "prop-types";
import {Layout, Typography} from "antd";
// import "./LeftMenu.less";

const {Sider} = Layout;

export default function LeftMenu(props) {
    return (
        <div style={styles.container}>
            <div style={styles.top}>
                <Typography.Title
                    style={{color: "white"}}
                    level={3}>
                    账单管理
                </Typography.Title>
            </div>
            <div style={styles.menu}>
                <RouteMenu
                    childRouteData={props.value}/>
            </div>
        </div>
    )
}

LeftMenu.propTypes = {
    value: PropTypes.object.isRequired,
};

const styles = {
    container: {
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        flexShrink: 0,
        boxSizing:"border-box"
    },
    top: {
        display:"flex",
        width: "100%",
        height: "64px",
        justifyContent:"center",
        alignItems:"center",
        zIndex:1,
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        backgroundColor: "rgba(47, 50, 63)",
    },
    menu: {
        width: "100%",
        height: 0,
        flex: 1,
    },
};