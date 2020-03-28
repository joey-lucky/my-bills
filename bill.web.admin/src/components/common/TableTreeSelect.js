import * as React from "react";
import * as PropTypes from "prop-types";
import {TreeSelect} from "antd";
import {observer} from "mobx-react";
import {Ajax} from "@utils/ajax";
import PropsUtils from "@utils/PropsUtils";
const { TreeNode } = TreeSelect;

@observer
export default class TableTreeSelect extends React.Component {
    static createDictProps(dictTypeCode, parentCode) {
        let params = {
            DICT_TYPE_CODE: dictTypeCode || "",
            PARENT_CODE: parentCode || ""
        };
        return {
            url: "/common/pc/systemmanager/systemsetting/dict/data/get-dict-child-list",
            params,
            parse: {id: "CODE", name: "VALUE"}
        };
    }

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
        size: PropTypes.oneOf(["default", "large", "small"]),
        notFoundContent: PropTypes.any,
        showSearch: PropTypes.bool,
        optionLabelProp: PropTypes.string,
        transitionName: PropTypes.string,
        choiceTransitionName: PropTypes.string,
        id: PropTypes.string,
        disabled: PropTypes.bool,
    };

    _loadDataPromise;
    _dataMap = {};

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
        const {url, params, parse, extraOptions = []} = props;
        if (url) {
            this._loadDataPromise = Ajax.apiPost(url, params)
                .then((d) => {
                    let data = d.data || [];
                    data = this.parseData(data, parse);
                    let allData = [...extraOptions, ...data];
                    this.setState({
                        data: data
                    });
                });
        }
    };

    parseData(data = [], parse) {
        if (!parse) {
            return data;
        }
        return data.map((item, index, array) => {
            let children = [];
            if (item.children) {
                children = this.parseData(item.children, parse);
            }
            if (parse === "function") {
                item = parse(item, index, array) || {};
            } else if (typeof parse === "object") {
                let {id = "id", name = "name"} = parse;
                item.id = item[id];
                item.name = item[name];
            }
            item.children = children;
            return item;
        });
    }

    onChange = (value) => {
        if (value !== this.state.value) {
            if (!("value" in this.props)) {
                this.setState({
                    value: value
                });
            }
            this.props.onChange && this.props.onChange(value);
        }
    };

    filterOption = (inputValue = "", option) => option.props.children.indexOf(inputValue) > -1;

    renderItem(data = []) {
        return data.map(item => (
            <TreeNode
                key={"tree-node-" + item.id}
                value={item.id}
                title={item.name}
            >
                {
                    item.children && this.renderItem(item.children)
                }
            </TreeNode>
        ))
    }

    render() {
        const {data = [], value} = this.state;
        return (
            <TreeSelect
                {...this.props}
                filterOption={this.filterOption}
                value={value}
                onChange={this.onChange}
            >
                {this.renderItem(data)}
            </TreeSelect>
        );
    }
}
