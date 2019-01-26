/**
 * tags选择
 */
import React from "react";
import * as PropTypes from "prop-types";
import {Tag} from "antd";
import {autorun, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Request} from "@utils/ajax";

const CheckableTag = Tag.CheckableTag;

class DomainTagsState {

    /**
     * 字典代码
     */
    @observable dictTypeCode;

    /**
     * 源数据
     */
    @observable data = [];

    /**
     * 选中数据源
     */
    @observable selectedTags = [];

    constructor(dictTypeCode, soureData) {
        if (dictTypeCode !== "") {
            this.dictTypeCode = dictTypeCode;
            autorun(() => {
                Ajax.apiPost("/systemmanager/systemsetting/dict/data/list", {"dictTypeCode": this.dictTypeCode}).then((data) => {
                    this.data = data.data;
                });
            });
        } else {
            this.data = soureData;
        }

    }
}

@observer
class DomainTags extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        onChange: PropTypes.any
    };

    static newState(dictTypeCode, soureData) {
        return new DomainTagsState(dictTypeCode, soureData);
    }

    handleChange(tag, checked) {
        const nextSelectedTags = checked ? [...this.props.state.selectedTags, tag] : this.props.state.selectedTags.filter(t => t !== tag);
        this.props.state.selectedTags = nextSelectedTags;
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(toJS(this.props.state.selectedTags));
        }
    }

    render() {
        return (
            <div>
                {this.props.state.data.map(tag => (
                    <CheckableTag
                        key={tag.CODE} checked={this.props.state.selectedTags.indexOf(tag.CODE) > -1}
                        onChange={checked => this.handleChange(tag.CODE, checked)}
                    >
                        {tag.VALUE}
                    </CheckableTag>
                ))}
            </div>
        );
    }

}

export default DomainTags;
