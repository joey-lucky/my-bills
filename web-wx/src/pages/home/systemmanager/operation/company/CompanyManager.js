import React from "react";
import {Button, Col, Input, Row} from "antd";

import CompanyAdd from "./CompanyAdd";
import CompanyList from "./CompanyList";

const Search = Input.Search;

class CompanyManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            companyAddState: CompanyAdd.newState(),
            companyListState: CompanyList.newState()
        };
        this.state.companyListState.getList();
    }

    /**
     * 新增点击事件
     */
    onAddClick() {
        var data = {};
        this.state.companyAddState.data = data;
        this.state.companyAddState.show();
    }

    /**
     * 新增完成事件，刷新列表
     */
    onAdded() {
        this.state.companyListState.getList();
    }

    /**
     * 查询事件，根据关键字查询
     */
    onSearch(keyWord) {
        this.state.companyListState.getList(keyWord);
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
                <CompanyAdd state={this.state.companyAddState} onAdded={() => this.onAdded()}/>
                <CompanyList state={this.state.companyListState}/>
            </div>
        );
    }
}

export default CompanyManager;
