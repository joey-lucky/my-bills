import React from "react";
import {Tree} from "antd";
import * as PropTypes from "prop-types";

const TreeNode = Tree.TreeNode;

/**
 * 树
 */
class UsTree extends React.Component {
    static propTypes = {
        onChange: PropTypes.any,
        value: PropTypes.any,
        dataSource: PropTypes.any
    };

    constructor(props) {
        super(props);
        const {value} = this.props;
        let selectFunctions = [];
        if (value && value instanceof Array) {
            value.forEach((item) => {
                selectFunctions.push(item);
            });
        }
        this.state = {
            expandedKeys: selectFunctions,
            checkedKeys: selectFunctions
        };

    }

    /**
     * 当父组件改变Props的时候，触发此事件
     */
    componentWillReceiveProps(nextProps) {
        const {value: nextValue} = nextProps;
        const {value} = this.props;
        if (JSON.stringify(value) !== JSON.stringify(nextValue)) {
            let selectFunctions = [...nextValue];
            this.setState({
                expandedKeys: selectFunctions,
                checkedKeys: selectFunctions
            });
        }
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys: expandedKeys,
            autoExpandParent: false
        });
    };

    onCheck = (checkedKeys) => {
        const onchange = this.props.onChange;

        if (onchange) {
            onchange(checkedKeys);
        }
        this.setState({checkedKeys: checkedKeys});
    };

    renderTreeNodes(data) {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.NAME} key={item.ID} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.NAME} key={item.ID}/>;
        });
    }

    render() {

        return (
            <Tree
                checkable
                checkedKeys={this.state.checkedKeys}
                onCheck={checkedKeys => this.onCheck(checkedKeys)}
            >
                {this.renderTreeNodes(this.props.dataSource)}
            </Tree>
        );
    }
}

export default UsTree;
