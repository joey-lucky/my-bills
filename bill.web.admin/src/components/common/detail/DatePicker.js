import * as React from "react";
import * as PropTypes from "prop-types";
import Input from "@components/common/detail/Input";


export default class DatePicker extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        onChange: PropTypes.func,
        format: PropTypes.string,
    };

    render() {
        const {format = "YYYY-MM-DD HH:mm:ss"} = this.props;
        let value = this.props.value || this.props.defaultValue;
        let dateTimeString = value && value.format && value.format(format)||"";
        return (
            <Input value={dateTimeString}/>
        );
    }
}