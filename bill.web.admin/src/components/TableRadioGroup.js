import React from "react";
import {toJS} from "mobx";
import * as PropTypes from "prop-types";
import {Radio} from "antd";
import {Ajax} from "@utils/ajax";
import PropsUtils from "@utils/PropsUtils";


export default class TableRadioGroup extends React.Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        parse: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired,
        params: PropTypes.object,
        value: PropTypes.any,
        defaultValue: PropTypes.any,
        onChange: PropTypes.any,
        extraOptions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }))
    };

    static createDictProps(dictTypeCode, parentCode) {
        let params = {
            DICT_TYPE_CODE: dictTypeCode || "",
            PARENT_CODE: parentCode || ""
        };
        return {
            url: "/systemmanager/systemsetting/dict/data/get-dict-child-list",
            params,
            parse: {id: "CODE", name: "VALUE"}
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: this.props.value || this.props.defaultValue || ""
        };
    }

    componentDidMount() {
        this.asyncLoadData(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!PropsUtils.isEqual(this.props, nextProps, "url") || !PropsUtils.isEqual(this.props, nextProps, "params")) {
            this.asyncLoadData(nextProps);
        }
        if (!PropsUtils.isEqual(this.props, nextProps, "value") && !PropsUtils.isEqual(this.state, nextProps, "value")) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    asyncLoadData = ({url = "", params = {}}) => {
        this.pageIndex = params.pageIndex;
        if (url) {
            Ajax.apiPost(url, toJS(params))
                .then((d) => {
                    let data = d.data || [];
                    this.setState({
                        data
                    });
                });
        }
    };

    onChange = (event) => {
        this.setState({
            value: event.target.value
        });
        this.props.onChange && this.props.onChange(event.target.value);
    };

    render() {
        let {
            url, params, parse,
            extraOptions = [],
            onChange, value: propValue,
            ...props
        } = this.props;
        let {data, value} = this.state;
        return (
            <Radio.Group
                {...props}
                value={value}
                onChange={this.onChange}
            >
                {
                    extraOptions.map((item, index) =>
                        <Radio key={"extra_" + item.id + index} value={item.id}>{item.name}</Radio>
                    )
                }
                {
                    data.map(item =>
                        <Radio key={"data_" + item[parse.id]} value={item[parse.id]}>{item[parse.name]}</Radio>
                    )
                }
            </Radio.Group>
        );
    }
}
