import * as React from "react";
import * as PropTypes from "prop-types";
import {Select} from "antd";
import {observer} from "mobx-react";
import {Ajax} from "@utils/ajax";
import PropsUtils from "@utils/PropsUtils";

@observer
export default class TableSelect extends React.Component {
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

    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        url: PropTypes.string.isRequired,
        params: PropTypes.object,
        parse: PropTypes.oneOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }),
            PropTypes.func
        ).isRequired,
        extraOptions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }))
    };

    _loadDataPromise;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: this.props.value || this.props.defaultValue || undefined
        };
    }

    // 第一次加载获取一次数据
    componentDidMount() {
        this.asyncLoadData(this.props);
    }

    // dictTypeCode或者fatherId 发生改变时获取数据
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

    componentWillUnmount() {
        if (this._loadDataPromise) {
            this._loadDataPromise.cancel("组件卸载");
        }
    }

    asyncLoadData = (props) => {
        const {url, params} = props;
        this._loadDataPromise = Ajax.apiPost(url, params)
            .then((d) => {
                let data = d.data || [];
                let {parse} = this.props;
                if (parse && typeof parse === "function") {
                    data = data.map(parse);
                }
                this.setState({
                    data: data
                });
            });
    };

    onChange = (value) => {
        this.setState({
            value: value
        });
        this.props.onChange && this.props.onChange(value);
    };

    filterOption = (inputValue = "", option) => option.props.children.indexOf(inputValue) > -1;

    getSelectProps = () => {
        let props = {};
        let userDefinedPropKey = Object.keys(TableSelect.propTypes);
        userDefinedPropKey.push("filterOption");
        Object.keys(this.props).forEach((key) => {
            if (userDefinedPropKey.indexOf(key) === -1) {
                props[key] = this.props[key];
            }
        });
        return props;
    };

    render() {
        const {extraOptions = [], parse} = this.props;
        const {data = [], value} = this.state;
        let parseIsFunction = typeof parse === "function";
        return (
            <Select
                {...this.getSelectProps()}
                filterOption={this.filterOption}
                value={value}
                onChange={this.onChange}
            >
                {
                    extraOptions.map((item, index) =>
                        <Select.Option key={"extra_" + item.id + index} value={item.id}>{item.name}</Select.Option>
                    )
                }
                {
                    data.map((item, index) => {
                        if (parseIsFunction) {
                            return (
                                <Select.Option
                                    key={"data_" + item.id}
                                    value={item.id}
                                >{item.name}</Select.Option>
                            );
                        } else {
                            return (
                                <Select.Option
                                    key={"data_" + item[parse.id]}
                                    value={item[parse.id]}
                                >{item[parse.name]}</Select.Option>
                            );
                        }
                    })
                }
            </Select>
        );
    }
}
