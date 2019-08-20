import * as React from "react";
import {Flex} from "antd-mobile";
import * as PropTypes from "prop-types";
import FontIcon from "@components/FontIcon";
import * as styles from "./SettingItem.css";
import icons from "@res/icons";
import {Divider} from "@components/Divider";

export default class SettingItem extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        label: PropTypes.string,
    };

    render() {
        return (
            <div
                className={styles.container}
                onClick={this.props.onClick}
            >
                <div className={styles.content}>
                    <FontIcon
                        className={styles.leftIcon}
                        unicode={"&#xe321;"}
                    />
                    <div className={styles.label} >
                        {this.props.label}
                    </div>
                    <FontIcon
                        className={styles.rightIcon}
                        unicode={icons.right}
                    />
                </div>
                <Divider direction={"row"} size={"1px"} colorType={"light"}/>
            </div>
        );
    }
}
