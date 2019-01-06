import React from "react";
import {Button, Col, Input, Row} from "antd";
import UserAdd from "./UserAdd";
import UserList from "./UserList";

const Search = Input.Search;

class UserManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userAddState: UserAdd.newState(),
            userListState: UserList.newState()
        };
        this.state.userListState.getList();
    }

    /**
     * 新增点击事件
     */
    onAddClick() {
        var data = {};
        this.state.userAddState.data = data;
        this.state.userAddState.show();
    }

    /**
     * 新增完成事件，刷新列表
     */
    onAdded() {
        this.state.userListState.getList();
    }

    /**
     * 查询事件，根据关键字查询
     */
    onSearch(keyWord) {
        this.state.userListState.getList(keyWord);
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
                <UserAdd state={this.state.userAddState} onAdded={() => this.onAdded()}/>
                <UserList state={this.state.userListState}/>
            </div>
        );
    }
}

export default UserManager;
