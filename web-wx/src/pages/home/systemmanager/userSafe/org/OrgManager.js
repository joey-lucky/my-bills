import React from "react";
import {Button, Col, Input, Row} from "antd";
import OrgAdd from "./OrgAdd";
import OrgList from "./OrgList";

const Search = Input.Search;

class OrgManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orgAddState: OrgAdd.newState(),
            orgListState: OrgList.newState()
        };
        this.state.orgListState.getList();
    }

    /**
     * 新增点击事件
     */
    onAddClick() {
        var data = {};
        this.state.orgAddState.data = data;
        this.state.orgAddState.show();
    }

    /**
     * 新增完成事件，刷新列表
     */
    onAdded() {
        this.state.orgListState.getList();
    }


    /**
     * 查询事件，根据关键字查询
     */
    onSearch(keyWord) {
        this.state.orgListState.getList(keyWord);
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
                <OrgAdd state={this.state.orgAddState} onAdded={() => this.onAdded()}/>
                <OrgList state={this.state.orgListState}/>
            </div>
        );
    }
}

export default OrgManager;
