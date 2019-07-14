import * as React from "react";
import * as PropTypes from "prop-types";
import {DatePicker, Flex} from "antd-mobile";
import Text from "@components/Text";
import FormItem from "./FormItem";
import icons from "@res/icons";
import moment from "moment";

export default class DateItem extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onChange: PropTypes.any,
        value: PropTypes.objectOf(Date),
        defaultValue: PropTypes.string,
        mode: PropTypes.oneOf(['datetime', 'date', 'year', 'month', 'time'])
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if ("value" in nextProps && nextProps.value) {//value存在。
            let time = nextProps.value.getTime();
            let prevTime = prevState.value && prevState.value.getTime() || 0;
            if (time !== prevTime) {
                return {
                    value: nextProps.value
                };
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || props.defaultValue,
            visible: false,
        };
    }

    onClick = (e) => {
        e.stopPropagation();
        this.setState({
            visible: true
        });
    };

    onPickerChange = (value) => {
        let time = value.getTime();
        let prevTime = this.state.value && this.state.value.getTime() || 0;
        if (time !== prevTime) {
            if (!this.props.value) {
                this.setState({
                    value: value
                });
            }
            this.props.onChange && this.props.onChange(value);
        }
    };

    onVisibleChange = (visible) => {
        if (this.state.visible !== visible) {
            this.setState({visible: visible})
        }
    };

    formatDateTimeString(){
        let format = "YYYY-MM-DD HH:mm:ss";
        if (this.props.mode === "date") {
            format = "YYYY-MM-DD";
        }else if (this.props.mode === "year") {
            format = "YYYY";
        }else if (this.props.mode === "month") {
            format = "MM";
        }else if (this.props.mode === "time") {
            format = "HH:mm:ss";
        }
        let {value} = this.state;
        return value && moment(value).format(format) || "";
    }

    render() {
        const {value, visible} = this.state;
        const {mode = "datetime", label} = this.props;
        let datetimeStr = this.formatDateTimeString();
        return (
            <React.Fragment>
                <DatePicker
                    visible={visible}
                    mode={mode}
                    onVisibleChange={this.onVisibleChange}
                    onChange={this.onPickerChange}
                    value={value}
                />
                <FormItem
                    style={{width: "100%", height: "100%"}}
                    align={"center"}
                    label={label}
                    icon={icons.xe321}
                    color={"#8880EF"}
                    onClick={this.onClick}
                >
                    <Flex
                        style={{width: "100%", height: "100%"}}
                        direction={"row"}
                        align={"center"}
                    >
                        <Text type={"title"} text={datetimeStr}/>
                    </Flex>
                </FormItem>
            </React.Fragment>


        );
    }
}
