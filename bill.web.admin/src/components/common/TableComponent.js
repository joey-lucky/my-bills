import * as React from "react";
import * as PropTypes from "prop-types";
import {Ajax} from "@utils/ajax";
import PropsUtils from "@utils/PropsUtils";

export default class TableComponent extends React.Component {
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

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: this.props.value || this.props.defaultValue || undefined,
            selectItem: undefined,
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
            let selectItem =  this.state.data.find((item) => item.id = nextProps.value);
            this.setState({
                value: nextProps.value,
                selectItem: selectItem,
            });
        }
    }

    componentWillUnmount() {
        if (this._loadDataPromise) {
            this._loadDataPromise.cancel("组件卸载");
        }
    }

    asyncLoadData = (props) => {
        const {url, params,extraOptions=[]} = props;
        this._loadDataPromise = Ajax.apiPost(url, params)
            .then((d) => {
                let data = d.data || [];
                let {parse} = this.props;
                if (parse) {
                    if (typeof parse === "function") {
                        data = data.map(parse);
                    } else {
                        let {id = "id", name = "name"} = parse;
                        data.forEach(item => {
                            item.id = item[id];
                            item.name = item[name];
                        });
                    }
                }
                data = [...extraOptions, ...data];
                let selectItem = data.find(item => item.id === this.state.value);
                this.setState({
                    data: data,
                    selectItem: selectItem,
                });
            });
    };

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
}
