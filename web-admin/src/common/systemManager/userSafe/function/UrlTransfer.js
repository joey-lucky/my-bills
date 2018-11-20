import * as PropTypes from "prop-types";
import React from "react";
import {Transfer} from "antd";
import {Ajax} from "../../../unit/ajax";

class UrlTransfer extends React.Component {
    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.any
    };
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            targetData: []
        };

        if ("value" in props && props.value != null) {
            var urls = props.value.split(",");
            this.state.targetData = urls;
        }

        this.getDataSource();
    }

    onChange(nextTargetKeys) {
        this.setState({targetData: nextTargetKeys});

        var urls = "";

        nextTargetKeys.forEach((url) => {
            urls = urls + url + ",";
        });

        const onchange = this.props.onChange;

        if (onchange) {
            onchange(urls);
        }
    }

    /**
     * 获取数据源
     */
    getDataSource() {
        Ajax.apiPost("/systemmanager/usersafe/function/systemurllist").then((d) => {
            var data = d.data.map(item => ({url: item, key: item}));
            this.setState({dataSource: data});
        });
    }

    /**
     * 过滤函数，简单做匹配
     */
    filterOption = (inputValue, option) => option.url.indexOf(inputValue) > -1

    render() {

        return (
            <Transfer
                dataSource={this.state.dataSource}
                targetKeys={this.state.targetData}
                listStyle={{
                    width: 350,
                    height: 400
                }}
                showSearch
                filterOption={this.filterOption}
                onChange={nextTargetKeys => this.onChange(nextTargetKeys)}
                render={url => url.url}
            />
        );
    }
}

export default UrlTransfer;
