import * as React from "react";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import {request} from "@utils/request";
import {List, Picker} from "antd-mobile";

@observer
export default class PickerItem extends React.Component {
    static propTypes = {
        label: PropTypes.any,
        pickerTitle: PropTypes.any,
        onChange: PropTypes.any,
        value: PropTypes.any,
        url: PropTypes.any,
        parse: PropTypes.any,
        params: PropTypes.any
    };

    static getDomainProps = (dictTypeCode, params) => {
        if (!params) {
            params = {};
        }
        params["DICT_TYPE_CODE"] = dictTypeCode;
        return {
            url: "/systemmanager/systemsetting/dict/data/get-dict-child-list",
            params: params,
            parse: {id: "CODE", name: "VALUE"}
        };
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

    static getDerivedStateFromProps(nextProps, prevState) {
        let nextValue = nextProps.value;
        if (nextValue) {//value存在。
            let {data, value} = prevState;
            if (value !== nextValue) {
                let index = data.findIndex((item) => item.value === nextValue);
                return {
                    selectIndex: index,
                    value: nextValue,
                };
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectIndex: -1,
            value: ""
        };
    }

    componentDidMount() {
        this.asyncLoadData(this.props).then((data = []) => {
            let {defaultValue, value} = this.props;
            let index = -1;
            if (value) {
                index = data.findIndex((item) => item.value === value);
            } else if (defaultValue) {
                index = data.findIndex((item) => item.value === defaultValue);
            }
            this.setState({
                data: data,
                selectIndex:index,
            });
        });
    }

    asyncLoadData = (props) => {
        const {url, parse, params} = props;
        return request(url, params)
            .then((d) => {
                const {id = "ID", name = "NAME"} = parse;
                let data = d.data || [];
                return data.map(item => ({
                    value: item[id],
                    label: item[name],
                    children:[]
                }));
            });
    };

    onPickerChange = (values) => {
        let value = values[0];
        let {data=[]} = this.state;
        let index = data.findIndex((item) => {
            return item.value === value
        });
        this.setState({
            selectIndex:index,
            value:value
        });
        this.props.onChange && this.props.onChange(value);
    };

    render() {
        const {data, selectIndex} = this.state;
        const {
            label = "未定义",
            pickerTitle = "请选择"
        } = this.props;
        let selectItem = data[selectIndex] || {};
        return (
            <Picker
                title={pickerTitle}
                data={data}
                cols={1}
                extra={selectItem.label}
                value={[selectItem.value]}
                onChange={this.onPickerChange}
            >
                <List.Item arrow="horizontal">{label}</List.Item>
            </Picker>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!PickerItem.isEqual(this.props, prevProps, "url") ||
            !PickerItem.isEqual(this.props, prevProps, "parse") ||
            !PickerItem.isEqual(this.props, prevProps, "params")) {
            this.asyncLoadData(this.props).then((data = []) => {
                let {value} = this.props;
                //获取数据，初始化为默认值
                let index = data.findIndex((item) => item.value === value);
                this.setState({
                    data: data,
                    selectIndex: index
                });
            });
        }
    }
}
