/**
 * 新增企业组件
 */
import React from "react";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Button, Col, Form, Popconfirm, Row} from "antd";
import {FormDialogState} from "@components/FormDialog";
import {entListState} from "../EntManager";

// 默认左右两边的form item
const FormItem = ({label = "", children, labelCol = {span: 4}, wrapperCol = {span: 16}}) => (
    <Form.Item
        label={label}
        style={{width: "100%"}}
        colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
    >
        {children}
    </Form.Item>
);
FormItem.propTypes = {
    label: PropTypes.any,
    children: PropTypes.any,
    labelCol: PropTypes.any,
    wrapperCol: PropTypes.any
};

class AppState extends FormDialogState {
}

@Form.create()
@observer
export default class EntDetail extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        history: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    onDeleteClick = () => {
        entListState.deleteEnt();
    };

    onEditClick = () => {
        entListState.showEditDialog();
    };

    render() {
        return (
            <Form layout="inline" style={{height: "100%", width: "100%"}}>
                <Row
                    style={{marginTop: "5px"}}
                    align={"bottom"}
                    gutter={8}
                    justify={"end"}
                    type={"flex"}
                >
                    <Col>
                        <Popconfirm
                            title="确定要删除吗？"
                            onConfirm={this.onDeleteClick}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="normal">删除</Button>
                        </Popconfirm>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={this.onEditClick}>编辑</Button>
                    </Col>
                    <Col span={1}/>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="企业名称"
                        >
                            {entListState.ent.NAME}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="企业编号"
                        >
                            {entListState.ent.CODE}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            label="法人代码"
                        >
                            {entListState.ent.LEGAL_PERSON_CODE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="企业地址"
                        >
                            {entListState.ent.ADDRESS}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={22}>
                        <FormItem
                            label="所属政区"
                            labelCol={{span: 2}}
                            wrapperCol={{span: 20}}
                        >
                            <Row>
                                <Form.Item
                                    style={{width: "100%"}}
                                    wrapperCol={{span: 24}}
                                >
                                    {entListState.ent.PL_AREACODE_DESC}
                                    {entListState.ent.CL_AREACODE_DESC}
                                    {entListState.ent.DL_AREACODE_DESC}
                                </Form.Item>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="企业规模"
                        >
                            {entListState.ent.SCALE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="行业类型"
                        >
                            {entListState.ent.INDUSTRY_TYPE}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="投产日期"
                        >
                            {entListState.ent.COMMISSIONING_DATE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="建设状态"
                        >
                            {entListState.ent.CONSTRUCTION_STATE}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem
                            label="受纳水体"
                        >
                            {entListState.ent.RECEIVE_WATER}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            label="排放流域"
                        >
                            {entListState.ent.DRAINAGE_BASIN}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="是否可监控">
                            {entListState.ent.CAN_MONITOR}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="运营单位">
                            {entListState.ent.OPERATION_UNIT_DESC}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="法人代表">
                            {entListState.ent.LEGAL_REP}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="占地面积">
                            {entListState.ent.AREA_COVERED}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="环保负责人">
                            {entListState.ent.EP_CHARGE_PERSON}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="专职环保人数">
                            {entListState.ent.EP_STAFF_NUMBER}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="开户银行">
                            {entListState.ent.BANK}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="银行账户">
                            {entListState.ent.BANK_ACCOUNT}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="办公电话">
                            {entListState.ent.TEL}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="移动电话">
                            {entListState.ent.MOBILE}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="传真">
                            {entListState.ent.FAX}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="联系人">
                            {entListState.ent.CONTACT}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="企业网址">
                            {entListState.ent.WEBSITE}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="电子邮箱">
                            {entListState.ent.EMAIL}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <FormItem label="隶属关系">
                            {entListState.ent.AFFILIATION_DESC}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="业务分类">
                            {entListState.ent.BUSS_CATEGORY_DESC}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="公司简介">
                            {entListState.ent.REMARK}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
