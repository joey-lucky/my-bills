import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";

export default class MoneyInput extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.number,
        defaultValue: PropTypes.number,
        color: PropTypes.string,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if ("value" in nextProps && nextProps.value !== prevState.value) {//value存在。
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            value: "",
        };
    }

    onChange = (event) => {
        let value = event.target.value || "";
        if (value !== this.state.value) {
            if (/^(([0]?)|(0\.[0-9]*)|([1-9][0-9]*[\.]?[0-9]*))$/.test(value)) {
                if ("value" in this.props) {
                    this.setState({
                        value: value
                    });
                }
                this.props.onChange && this.props.onChange(value);
            } else {
                this.setState({
                    value: this.state.value
                });
            }
        }
    };

    render() {
        const {value} = this.state;
        let style = {
            ...styles.money,
            color: this.props.color,
            borderBottom: "0.04rem solid " + this.props.color
        };

        return (
            <Flex style={styles.container}>
                <input
                    value={value}
                    onChange={this.onChange}
                    style={style}
                    placeholder={""}
                    // type={"number"}
                    // min={0}
                />
            </Flex>
        );
    }
}

const styles = {
    container: {
        height: "3.15rem",
        paddingLeft: "0.86rem",
        width: "100%",
    },
    money: {
        width: "100%",
        height: "100%",
        lineHeight: "3.15rem",
        fontSize: fontSizes.display4,
        border: "none",
        borderRight: "none",
        borderLeft: "none",
        fontWeight: "bold",
    },
};