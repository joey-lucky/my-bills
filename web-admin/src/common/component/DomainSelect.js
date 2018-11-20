import * as React from "react";
import * as PropTypes from "prop-types";
import {Select} from "antd";
import {observer} from "mobx-react";
import {Ajax} from "../unit/ajax";

const NULL = "DOMAIN_SELECT_NULL";

@observer
export default class DomainSelect extends React.Component {
    static propTypes = {
        dictTypeCode: PropTypes.any,
        parentCode: PropTypes.any,
        onChange: PropTypes.any,
        value: PropTypes.any,
        style: PropTypes.any,
        emptyLabel: PropTypes.any,
        extraOptions: PropTypes.any,
        onSelect: PropTypes.any,
        width: PropTypes.any,
        showSearch: PropTypes.any
    };

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

    // dictTypeCode或者fatherId 发生改变时获取数据
    componentWillReceiveProps(nextProps, nextContext) {
        const {dictTypeCode, parentCode} = this.props;
        if (dictTypeCode !== nextProps.dictTypeCode || parentCode !== nextProps.parentCode) {
            this.loadData(nextProps);
        }
    }

    loadData = (props) => {
        const {dictTypeCode, parentCode} = props;
        let params = {
            DICT_TYPE_CODE: dictTypeCode || "",
            PARENT_CODE: parentCode || ""
        };
        Ajax.apiPost("/systemmanager/systemsetting/dict/data/get-dict-child-list", params)
            .then((d) => {
                this.setState({
                    data: d.data || []
                });
            });
    };

    onChange = (value) => {
        const {onChange} = this.props;
        onChange && onChange(value);
    };

    filterOption = (inputValue = "", option) => option.props.children.indexOf(inputValue) > -1;

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

    getSelectOption = ({CODE, VALUE = ""}) => {
        let key = CODE && CODE !== "" ? CODE : VALUE;
        return (<Select.Option key={key} value={CODE}>{VALUE}</Select.Option>);
    };

    parseToStyle(style, width) {
        // 默认宽度180
        let resultStyle = {width: width || 180};
        if (style) {
            resultStyle = {...resultStyle, ...style};
        }
        return resultStyle;
    }

    /**
     * props属性：
     * extraOptions:string|object|array object:{CODE:string,VALUE:string} 额外的选项
     * emptyLabel:string CODE为空的选项，可以理解为未选中状态
     *
     * 例如:额外增加一个全部选项的方式
     * <DomainSelect emptyLabel="全部"/>
     * <DomainSelect extraOptions={{CODE:"",VALUE:"全部"}}/>
     * <DomainSelect extraOptions={{CODE:"0",VALUE:"全部"}}/>
     * <DomainSelect extraOptions={[{CODE:"1",VALUE:"全部"}]}/>
     */
    render() {
        const {showSearch = true} = this.props;
        const {onSelect, width, style, extraOptions, emptyLabel} = this.props;
        const {data, defaultValue} = this.state;
        return (
            <Select
                showSearch={showSearch}
                filterOption={this.filterOption}
                defaultValue={defaultValue}
                onChange={this.onChange}
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
                        <Select.Option key={item.CODE} value={item.CODE}>{item.VALUE}</Select.Option>
                    )
                }
            </Select>
        );
    }
}
