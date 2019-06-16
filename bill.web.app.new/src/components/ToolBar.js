import * as React from "react";
import {Flex} from "antd-mobile";
import Blank from "@components/Blank";
import FontIcon from "@components/FontIcon";
import Text from "@components/Text";
import * as PropTypes from "prop-types";


export default class ToolBar extends React.Component {
    static propTypes = {
        title: PropTypes.string,
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
                style={{width: "100%", height: "1.35rem"}}
                direction={"row"}
            >
                <Blank level={1} direction={"row"}/>
                <Blank
                    level={1}
                    direction={"row"}
                >
                    <Text type={"appBar"}>
                        <FontIcon unicode={FontIcon.icons.toolbar.left}/>
                    </Text>
                </Blank>
                <Text type={"appBar"} text={this.props.title || ""}/>
                <Flex.Item/>
                {
                    this.props.showSearch &&
                    <Blank
                        level={1}
                        direction={"row"}
                        onClick={this.props.onSearchClick}
                    >
                        <Text type={"appBar"}>
                            <FontIcon unicode={FontIcon.icons.toolbar.search}/>
                        </Text>
                    </Blank>
                }
                {
                    this.props.showConfirm &&
                    <Blank
                        level={1}
                        direction={"row"}
                        onClick={this.props.onConfirmClick}
                    >
                        <Text type={"appBar"}>
                            <FontIcon unicode={FontIcon.icons.toolbar.confirm}/>
                        </Text>
                    </Blank>
                }
                {
                    this.props.showAdd &&
                    <Blank
                        level={1}
                        direction={"row"}
                        onClick={this.props.onAddClick}
                    >
                        <Text type={"appBar"}>
                            <FontIcon unicode={FontIcon.icons.toolbar.add}/>
                        </Text>
                    </Blank>
                }
                <Blank level={2} direction={"row"}/>
            </Flex>
        );
    }
}