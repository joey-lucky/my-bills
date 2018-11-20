import * as React from "react";
import * as PropTypes from "prop-types";
import {Checkbox, Row} from "antd";
import {observer} from "mobx-react";
import {Ajax} from "../unit/ajax";

@observer
export default class DomainCheckBox extends React.Component {
    static propTypes = {
        dictTypeCode: PropTypes.any,
        parentCode: PropTypes.any,
        onChange: PropTypes.any,
        value: PropTypes.any,
        className: PropTypes.any,
        style: PropTypes.any,
        extraOptions: PropTypes.any
    };

    constructor(props) {
        super(props);
        console.log(JSON.stringify(props));
        this.state = {
            data: []
        };
    }

    // 第一次加载获取一次数据
    componentDidMount() {
        this.loadData(this.props);
    }


    // dictTypeCode或者fatherId 发生改变时获取数据
    componentWillReceiveProps(nextProps, nextContext) {
        const {dictTypeCode, parentCode} = this.props;
        if (dictTypeCode !== nextProps.dictTypeCode || parentCode !==
            nextProps.parentCode) {
            this.loadData(nextProps);
        }
    }

    loadData = (props) => {
        const {dictTypeCode, parentCode} = props;
        let params = {
            DICT_TYPE_CODE: dictTypeCode || "",
            PARENT_CODE: parentCode || ""
        };
        Ajax.apiPost("/systemmanager/systemsetting/dict/data/get-dict-child-list",
            params)
            .then((d) => {
                // 数据刷新后，修改选中项
                // let {value = [], onChange} = this.props;
                // let codeSet = new Set();
                let data = d.data || [];
                // data.forEach((item) => codeSet.add(item.CODE));
                // value = value.map((item) => codeSet.has(item));
                // onChange && onChange(value);
                this.setState({
                    data: data
                });
            });
    };

    onChange = (item, event) => {
        const {onChange, value = []} = this.props;
        // 选中
        if (event.target.checked) {
            value.push(item.CODE);
            onChange && onChange(value);
        } else {
            let indexOf = value.indexOf(item.CODE);
            if (indexOf > -1) {
                value.splice(indexOf, 1);
                onChange && onChange(value);
            }
        }
    };

    parseExtraOptions = (extraOptions) => {
        if (!extraOptions) {
            return null;
        } else if (Array.isArray(extraOptions)) {
            return extraOptions.map((item, index) => this.renderItem(item));
        } else if (typeof extraOptions === "object") {
            return this.renderItem(extraOptions);
        } else {
            return null;
        }
    };

    renderItem = (item) => {
        const {value = []} = this.props;
        let {CODE, VALUE} = item;
        return (
            <Checkbox
                key={this.generateKey(CODE)}
                value={CODE}
                checked={value.indexOf(CODE) > -1}
                onChange={event => this.onChange(item,
                    event)}
            >{VALUE}</Checkbox>
        );

    };

    // 如果value不符合要求，则生成随机字符串。
    generateKey(value) {
        if (value && typeof value === "string" && value.length > 0) {
            return value;
        } else {
            let randomStr = "";
            let hash = "0123456789abcdefghijklmnopqrstuvwxyz";
            for (let i = 0; i < 12; i++) {
                randomStr += hash.substr(Math.floor(Math.random() * 36), 1);
            }
            return randomStr;
        }
    }

    render() {
        // 数据
        const {data} = this.state;
        // 样式属性
        const {className, style} = this.props;
        // 数据相关的属性
        const {extraOptions = []} = this.props;
        // form表单专用的props属性
        return (
            <Row
                className={className}
                style={style}
            >
                {
                    this.parseExtraOptions(extraOptions)
                }
                {
                    data && data.map((item, index) => this.renderItem(item))
                }
            </Row>
        );
    }
}

