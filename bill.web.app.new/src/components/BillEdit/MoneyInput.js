import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";

export default class MoneyInput extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.objectOf(Date),
        defaultValue: PropTypes.string,
        color: PropTypes.string,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let nextValue = nextProps.value;
        if (nextValue) {//value存在。
            if (nextValue !== prevState.value) {
                return {
                    value: nextValue
                };
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            value: "",
        };
    }

    onChange = (value) => {
        if (value !== this.state.value) {
            if (!this.props.value) {
                this.setState({
                    value: value
                });
            }
            this.props.onChange && this.props.onChange(value);
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
                    style={style}
                    placeholder={""}
                    type={"number"}
                    min={0}
                    onChange={this.onChange}
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