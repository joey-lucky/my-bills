import * as React from "react";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import TableComponent from "../TableComponent";
import Input from "./Input";

@observer
export default class TableSelect extends TableComponent {
    static propTypes = {
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        onChange: PropTypes.func,
        url: PropTypes.string.isRequired,
        params: PropTypes.object,
        parse: PropTypes.oneOfType([
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }),
            PropTypes.func
        ]).isRequired,
        extraOptions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })),
        className: PropTypes.string,
        style: PropTypes.object,
    };

    render() {
        const {selectItem = {}} = this.state;
        return (
            <Input value={selectItem.name || ""}/>
        );
    }
}
