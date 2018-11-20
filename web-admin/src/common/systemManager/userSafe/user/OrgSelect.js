import React from "react";
import {TreeSelect} from "antd";
import * as PropTypes from "prop-types";
import {observer} from "mobx-react";
import {Ajax} from "../../../unit/ajax";

const TreeNode = TreeSelect.TreeNode;

@observer
class OrgSelect extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.any
    };

    constructor(props) {
        super(props);

        var value = null;

        if ("value" in props) {
            value = props.value;
        }
        this.state = {
            value: value,
            dataSource: []
        };

        this.getDataSource();
    }

    onChange(value) {

        this.setState({
            value: value
        });

        const onchange = this.props.onChange;

        if (onchange) {
            onchange(value);
        }
    }

    /**
     * 获取组织机构数据
     */
    getDataSource() {
        var me = this;
        Ajax.apiPost("/systemmanager/usersafe/org/list").then((data) => {
            me.setState({
                dataSource: data.data
            });
        });
    }

    renderTreeNodes(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.NAME} value={item.ID} key={item.ID} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.NAME} value={item.ID} key={item.ID}/>;
        });
    }

    render() {

        return (
            <TreeSelect
                onChange={value => this.onChange(value)}
                value={this.state.value}
            >
                {this.renderTreeNodes(this.state.dataSource)}
            </TreeSelect>
        );
    }
}

export default OrgSelect;
