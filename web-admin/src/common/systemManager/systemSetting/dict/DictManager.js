import React from "react";
import {withRouter} from "react-router-dom";
import {Breadcrumb, Button, Col, Input, Row} from "antd";
import DictDataManager from "./dictData/DictDataManager";
import DictTypeList from "./dictType/DictTypeList";
import DictTypeEdit from "./dictType/DictTypeEdit";
import DictTypeAdd from "./dictType/DictTypeAdd";

const Search = Input.Search;

export default withRouter(class DictManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dictDataManagerState: DictDataManager.newState(),
            dictTypeAddState: DictTypeAdd.newState(),
            dictTypeEditState: DictTypeEdit.newState(),
            dictTypeListState: DictTypeList.newState(),
            visible: "block",
            subBreadcrumbShow: false
        };
        this.state.dictTypeListState.getList();
    }

    /**
     * 增加字典类型按钮点击事件
     * 调出增加字典类型对话框
     */
    onDictTypeAddClick() {
        this.state.dictTypeAddState.show();
    }

    /**
     * 增加字典类型完成事件
     * 刷新字典类型列表
     */
    onDictTypeAdded() {
        this.state.dictTypeListState.getList();
    }

    /**
     * 字典类型编辑按钮点击事件
     * 调出字典类型编辑对话框
     */
    onDictTypeEditClick(data) {
        this.state.dictTypeEditState.setData(data);
        this.state.dictTypeEditState.show();
    }

    /**
     * 字典类型编辑完成事件
     * 刷新字典类型列表
     */
    onDictTypeEdited() {
        this.state.dictTypeListState.getList();
    }

    /**
     * 字典类型下的字典项，编辑事件
     * 隐藏字典类型模块，显示字典项模块
     */
    onDictDataEditClick(data) {
        this.state.dictDataManagerState.show(data.CODE);
        this.setState({
            visible: "none",
            subBreadcrumbShow: true,
            dictTypeName: data.NAME
        });
    }

    onBackClick() {
        this.state.dictDataManagerState.hide();
        this.setState({
            visible: "block",
            subBreadcrumbShow: false,
            dictTypeName: ""
        });
    }

    render() {

        const getChildBreadcrumb = () => {
            if (this.state.subBreadcrumbShow) {
                return (
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => this.onBackClick()}><a
                            href="javascript:void(0)"
                        >字典类型设置</a></Breadcrumb.Item>
                        <Breadcrumb.Item><a>字典项设置({this.state.dictTypeName})</a></Breadcrumb.Item>
                    </Breadcrumb>
                );
            } else {
                return (
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => this.onBackClick()}><a
                            href="javascript:void(0)"
                        >字典类型设置</a></Breadcrumb.Item>
                    </Breadcrumb>
                );
            }
        };

        return (
            <div>
                {getChildBreadcrumb()}
                <div style={{display: this.state.visible}}>
                    <Row type="flex" justify="space-around" style={{height: 50}} align="middle">
                        <Col span={6}>
                            <Search
                                placeholder="查询关键字"
                                enterButton
                                onSearch={value => this.state.dictTypeListState.getList(value)}
                            />
                        </Col>
                        <Col span={8} offset={10}>
                            <Button onClick={() => this.onDictTypeAddClick()}>新增字典</Button>
                        </Col>
                    </Row>
                    <DictTypeAdd state={this.state.dictTypeAddState} onAdded={() => this.onDictTypeAdded()}/>
                    <DictTypeEdit state={this.state.dictTypeEditState} onEdited={() => this.onDictTypeEdited()}/>
                    <DictTypeList
                        state={this.state.dictTypeListState}
                        onDictTypeEditClick={data => this.onDictTypeEditClick(data)}
                        onDictDataEditClick={data => this.onDictDataEditClick(data)}
                    />
                </div>
                <DictDataManager state={this.state.dictDataManagerState}/>
            </div>
        );
    }
});
