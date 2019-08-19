import * as React from "react";
import {Flex} from "antd-mobile";
import Blank from "@components/Blank";
import FontIcon from "@components/FontIcon";
import Text from "@components/Text";
import * as PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import icons from "@res/icons";
import fontSizes from "@res/fontSizes";

@withRouter
export default class ToolBar extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        rightExtra: PropTypes.any,
        showSearch: PropTypes.bool,
        showAdd: PropTypes.bool,
        showConfirm: PropTypes.bool,
        onSearchClick: PropTypes.func,
        onAddClick: PropTypes.func,
        onConfirmClick: PropTypes.func,
    };

    render() {
        return (
            <Flex
                style={{width: "100%", height: "1.5rem", boxShadow: "0px -0.02rem #F5F5F5 inset"}}
                direction={"row"}
            >
                <Blank level={1} direction={"row"}/>
                <Blank
                    onClick={() => {
                        this.props.history.goBack();
                    }}
                    level={1}
                    direction={"row"}
                >
                    <Text type={"appBar"}>
                        <FontIcon unicode={icons.left}/>
                    </Text>
                </Blank>
                <Text type={"appBar"} text={this.props.title || ""}/>
                <Flex.Item/>
                {
                    this.props.rightExtra
                }
                {
                    this.props.showSearch &&
                    <FontIcon
                        onClick={this.props.onSearchClick}
                        style={styles.icon}
                        unicode={icons.search}
                    />
                }
                {
                    this.props.showConfirm &&
                    <FontIcon
                        onClick={this.props.onConfirmClick}
                        style={styles.icon}
                        unicode={icons.confirm}
                    />
                }
                {
                    this.props.showAdd &&
                    <FontIcon
                        onClick={this.props.onAddClick}
                        style={styles.icon}
                        unicode={icons.add}
                    />
                }
                <Blank level={2} direction={"row"}/>
            </Flex>
        );
    }
}

const styles = {
    icon: {
        fontSize: fontSizes.display2,
        padding: "0 0.2rem",
        height: "100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    }
};