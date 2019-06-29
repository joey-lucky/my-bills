import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import FormItem from "./FormItem";
import icons from "@res/icons";

export default class InputItem extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onChange: PropTypes.any,
        value: PropTypes.objectOf(Date),
        defaultValue: PropTypes.string,
        mode: PropTypes.oneOf(['datetime', 'date', 'year', 'month', 'time'])
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
        const {label} = this.props;
        return (
            <FormItem
                align={"center"}
                label={label}
                icon={icons.xe321}
                color={"#8880EF"}
            >
                <Flex
                    style={styles.container}
                    direction={"row"}
                    align={"center"}
                >
                    <input
                        style={styles.input}
                        onChange={this.onChange}
                        value={value}
                    />
                </Flex>
            </FormItem>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    input: {
        width: "100%",
        height: "100%",
        border: "none",
        background: "none"
    }
};