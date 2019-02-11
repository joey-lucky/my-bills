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

    static isEqual(props, nextProps, key) {
        let propsValue = props[key] || "";
        let nextPropsValue = nextProps[key] || "";
        return JSON.stringify(propsValue) === JSON.stringify(nextPropsValue);
    }

    static findIndex(rows = [], value, fatherIndex = []) {
        for (let i = 0; i < rows.length; i++) {
            let item = rows[i];
            if (item.children) {
                let itemFatherIndex = [...fatherIndex, i];
                let findResult = PickerItem.findIndex(item.children, value, itemFatherIndex);
                if (itemFatherIndex !== findResult) {
                    return findResult;
                }
            } else {
                if (item.value === value) {
                    return [...fatherIndex, i];
                }
            }
        }
        return fatherIndex;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let nextValue = nextProps.value;
        if (nextValue) {//value存在。
            let {data, value} = prevState;
            if (value !== nextValue) {
                let index = PickerItem.findIndex(data, nextValue);
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
            selectIndex: [-1],
            value: "",
        };
    }

    componentDidMount() {
        this.asyncLoadData(this.props).then((data = []) => {
            let {defaultValue, value} = this.props;
            let index = [-1];
            if (value) {
                index = PickerItem.findIndex(data, value);
            } else if (defaultValue) {
                index = PickerItem.findIndex(data, defaultValue);
            }
            this.setState({
                data: data,
                selectIndex: index,
            });
        });
    }

    asyncLoadData = (props) => {
        const {url, parse, params, data} = props;
        if (data) {
            return Promise.resolve(data);
        }
        return request(url, params)
            .then((d) => {
                let data = d.data || [];
                return this.parseData(data, parse);
            });
    };

    parseData(rows, parse) {
        const {id = "id", name = "name"} = parse;
        return rows.map((item) => {
            let bean = {
                value: item[id],
                label: item[name],
            };
            if (item.children) {
                bean.children = this.parseData(item.children, parse);
            }
            return bean;
        });
    }

    onPickerChange = (values) => {
        let value = values[values.length - 1];
        let {data = []} = this.state;
        let index = PickerItem.findIndex(data, value);
        this.setState({
            selectIndex: index,
            value: value
        });
        this.props.onChange && this.props.onChange(value);
    };

    render() {
        const {data, selectIndex} = this.state;
        const {
            label = "未定义",
            pickerTitle = "请选择",
            cols = 1
        } = this.props;
        let selectItem = selectIndex.reduce((pre, curr, currentIndex) => {
            if (currentIndex === selectIndex.length - 1) {
                return pre[curr] || {};
            } else {
                return (pre[curr] && pre[curr].children) || [];
            }
        }, data);
        return (
            <Picker
                title={pickerTitle}
                data={data}
                cols={cols}
                extra={selectItem.label}
                value={[selectItem.value]}
                onOk={this.onPickerChange}
            >
                <List.Item arrow="horizontal">{label}</List.Item>
            </Picker>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let requestChange = !PickerItem.isEqual(this.props, prevProps, "url") ||
            !PickerItem.isEqual(this.props, prevProps, "parse") ||
            !PickerItem.isEqual(this.props, prevProps, "params");
        let dataChange = !PickerItem.isEqual(this.props, prevProps, "data");

        if (dataChange || requestChange) {
            this.asyncLoadData(this.props).then((data = []) => {
                let {value} = this.props;
                //获取数据，初始化为默认值
                let index = PickerItem.findIndex(data, value);
                this.setState({
                    data: data,
                    selectIndex: index
                });
            });
        }
    }
}
