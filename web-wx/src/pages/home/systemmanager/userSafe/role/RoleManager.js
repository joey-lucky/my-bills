import React from "react";
import {Button, Col, Input, Row} from "antd";
import RoleAdd from "./RoleAdd";
import RoleEdit from "./RoleEdit";
import RoleList from "./RoleList";
import RoleDetail from "./RoleDetail";


const Search = Input.Search;

export default class RoleManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roleAddState: RoleAdd.newState(),
            roleEditState: RoleEdit.newState(),
            roleListState: RoleList.newState(),
            roleDetailState: RoleDetail.newState()
        };
        this.state.roleListState.getList();
    }

    /**
     * 新增点击事件
     */
    onAddClick() {
        var data = {};
        this.state.roleAddState.data = data;
        this.state.roleAddState.show();
    }

    /**
     * 新增完成事件，刷新列表
     */
    onAdded() {
        this.state.roleListState.getList();
    }

    /**
     * 查询事件，根据关键字查询
     */
    onSearch(keyWord) {
        this.state.roleListState.getList(keyWord);
    }

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" style={{height: 50}} align="middle">
                    <Col span={6}>
                        <Search
                            placeholder="查询关键字"
                            enterButton
                            onSearch={value => this.onSearch(value)}
                        />
                    </Col>
                    <Col span={8} offset={10}>
                        <Button onClick={() => this.onAddClick()}>新增</Button>
                    </Col>
                </Row>
                <RoleAdd state={this.state.roleAddState} onAdded={() => this.onAdded()}/>
                <RoleList state={this.state.roleListState}/>
            </div>
        );
    }
}
