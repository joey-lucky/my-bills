import * as React from "react";
import * as PropTypes from "prop-types";
import FontIcon from "@components/FontIcon";
import * as styles from "./BillTypeItem.css";
import icons from "@res/icons";
import {Divider} from "@components/Divider";
import colors from "@res/colors";

export default class BillTypeItem extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        value: PropTypes.shape({
            name:PropTypes.string,
            typeName:PropTypes.string,
            type:PropTypes.string,
        }),
    };

    render() {
        let color = colors.getMoneyColor(this.props.value.typeName);
        return (
            <div
                onClick={this.props.onClick}
                className={styles.container}
            >
                <div className={styles.content}>
                    <FontIcon
                        className={styles.leftIcon}
                        style={{color:color}}
                        unicode={"&#xe321;"}
                    />
                    <div className={styles.textContent}>
                        <div className={styles.name}>{this.props.value.name}</div>
                        <div className={styles.typeName}>{this.props.value.typeName}</div>
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
