import * as React from "react";
import * as PropTypes from "prop-types";
import {Select} from "antd";
import {observer} from "mobx-react";
import Ajax from "../services/Ajax";

const NULL = "DOMAIN_SELECT_NULL";

@observer
export default class TableSelect extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.any,
        style: PropTypes.any,
        emptyLabel: PropTypes.any,
        extraOptions: PropTypes.any,
        onSelect: PropTypes.any,
        width: PropTypes.any,
        url: PropTypes.any,
        parse: PropTypes.any,
        params: PropTypes.any
    };

    static isEqual(props, nextProps, key) {
        let propsValue = props[key];
        let nextPropsValue = nextProps[key];
        if (propsValue !== null &&
            nextPropsValue !== null &&
            typeof propsValue === "object" &&
            typeof nextPropsValue === "object") {
            return JSON.stringify(propsValue) === JSON.stringify(nextPropsValue);
        } else {
            return propsValue === nextPropsValue;
        }
    }

    _loadDataPromise;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            defaultValue: this.props.value
        };
    }

    // 第一次加载获取一次数据
    componentDidMount() {
        this.loadData(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!TableSelect.isEqual(this.props, nextProps, "url") ||
            !TableSelect.isEqual(this.props, nextProps, "parse") ||
            !TableSelect.isEqual(this.props, nextProps, "params")) {
            this.loadData(nextProps);
        }
    }

    componentWillUnmount() {
        if (this._loadDataPromise) {
            this._loadDataPromise.cancel("组件卸载");
        }
    }

    loadData = (props) => {
        const {url, parse, params} = props;
        this._loadDataPromise = Ajax.apiPost(url, params)
            .then((d) => {
                const {id, name} = parse;
                let data = d.data || [];
                let parseData = data.map(item => ({
                    id: item[id],
                    name: item[name]
                }));
                this.setState({
                    data: parseData
                });
            });
    };

    parseExtraOptions = (extraOptions) => {
        if (!extraOptions) {
            return null;
        } else if (Array.isArray(extraOptions)) {
            return extraOptions.map((item, index) => this.getSelectOption(item));
        } else if (typeof extraOptions === "object") {
            return this.getSelectOption(extraOptions);
        } else {
            return null;
        }
    };

    getSelectOption = ({id, name = ""}) => {
        let key = id && id !== "" ? id : name;
        return (<Select.Option key={key} value={id}>{name}</Select.Option>);
    };

    parseToStyle(style, width) {
        // 默认宽度180
        let resultStyle = {width: width || 180};
        if (style) {
            resultStyle = {...resultStyle, ...style};
        }
        return resultStyle;
    }

    render() {
        const {onChange, onSelect, width, style, extraOptions, emptyLabel} = this.props;
        const {data, defaultValue} = this.state;
        return (
            <Select
                allowClear
                defaultValue={defaultValue}
                onChange={onChange}
                onSelect={onSelect}
                style={this.parseToStyle(style, width)}
            >
                {
                    emptyLabel && (<Select.Option key={NULL} value="">{emptyLabel}</Select.Option>)
                }
                {
                    this.parseExtraOptions(extraOptions)
                }
                {
                    data && data.map((item, index) =>
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    )
                }
            </Select>
        );
    }
}
