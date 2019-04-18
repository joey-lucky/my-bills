import * as React from "react";
import * as PropTypes from "prop-types";
import {Select, Transfer} from "antd";
import {observer} from "mobx-react";
import {Ajax} from "@utils/ajax";
import PropsUtils from "@utils/PropsUtils";
import {toJS} from "mobx";
import {TransferItem} from "antd/lib/transfer";

@observer
export default class TableTransfer extends React.Component {
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
        })),
        prefixCls: PropTypes.string,
        disabled: PropTypes.bool,
        height: PropTypes.number,
        style: PropTypes.object,
        listStyle: PropTypes.object,
        operationStyle: PropTypes.object,
        className: PropTypes.string,
        titles: PropTypes.arrayOf(PropTypes.string),
        operations: PropTypes.arrayOf(PropTypes.object),
        showSearch: PropTypes.bool,
        searchPlaceholder: PropTypes.string
    };

    _loadDataPromise;

    constructor(props) {
        super(props);
        const {value, defaultValue} = props;
        let stateValue = [];
        if (value && Array.isArray(value)) {
            stateValue = value;
        } else if (defaultValue && Array.isArray(defaultValue)) {
            stateValue = defaultValue;
        }
        this.state = {
            data: [],
            value: stateValue
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
                if (parse) {
                    if (typeof parse === "function") {
                        data = data.map((item, index, array) => {
                            let newItem = parse(item, index, array);
                            return {
                                ...item,
                                key: newItem.id,
                                id: newItem.id,
                                name: newItem.name
                            };
                        });
                    } else {
                        let {id, name} = parse;
                        data.forEach((item) => {
                            item.key = item[id];
                            item.id = item[id];
                            item.name = item[name];
                        });
                    }
                }
                this.setState({
                    data: data
                });
            });
    };


    onChange = (targetKeys, direction, moveKeys) => {
        const {onChange} = this.props;
        this.setState({
            value: targetKeys
        });
        onChange && onChange(targetKeys, direction, moveKeys);
    };

    filterOption = (inputValue = "", option) => option.props.children.indexOf(inputValue) > -1;

    render() {
        const {data, value} = this.state;
        const {
            titles = ["所有", "已选"],
            operations = ["添加", "移除"],
            locale = {searchPlaceholder: "关键字"},
            ...props
        } = this.props;

        return (
            <Transfer
                {...props}
                titles={titles}
                operations={operations}
                locale={locale}
                dataSource={data}
                targetKeys={value}
                showSearch
                filterOption={this.filterOption}
                onChange={this.onChange}
                render={item => item.name}
            />
        );
    }
}
