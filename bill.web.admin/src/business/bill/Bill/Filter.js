import {Button, DatePicker, Form, Input, Row, Space} from "antd";
import React from "react";
import {RemoteSelect, RemoteTreeSelect} from "@components";
import {billTypeAPI, cardAPI, dictDataAPI, userAPI} from "@services";

const cardLoadData = (...args) => {
    return cardAPI.index(...args).then(d=>{
        let data = d.data || [];
        data.sort((a, b) => a.userName.localeCompare(b.userName));
        return d;
    });
};

export default function Filter({onFinish,onCreateClick}) {
    return (
        <Form
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            layout={"inline"}
            onFinish={onFinish}
        >
            <Row style={{width: "100%",paddingTop:"12px"}}>
                <Form.Item
                    style={{width: 350}}
                    label={"关键字"}
                    name={"keyword"}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    style={{width: 350}}
                    label={"账单类型"}
                    name={"billTypeId"}
                >
                    <RemoteTreeSelect
                        loadData={billTypeAPI.index}
                        allowClear={true}
                    />
                </Form.Item>
                <Form.Item
                    style={{width: 350}}
                    label={"用户"}
                    name={"userId"}
                >
                    <RemoteSelect
                        loadData={userAPI.index}
                        allowClear={true}
                    />
                </Form.Item>
                <Form.Item
                    style={{width: 350}}
                    label={"类型"}
                    name={"billTypeType"}
                >
                    <RemoteSelect
                        loadData={dictDataAPI.index}
                        parse={{id:"code",name:"value"}}
                        params={{typeCode:"bill_type"}}
                        allowClear={true}
                    />
                </Form.Item>
                <Space>
                    <Button type={"primary"} htmlType={"submit"}>查询</Button>
                    <Button type={"primary"} onClick={onCreateClick}>新增</Button>
                </Space>
            </Row>
            <Row style={{width: "100%",padding:"12px 0"}}>
                <Form.Item
                    style={{width: 350}}
                    label={"开始时间"}
                    name={"dateTimeMoreThanOrEqual"}
                >
                    <DatePicker
                        style={{width:"100%"}}
                        mode={"date"}
                    />
                </Form.Item>
                <Form.Item
                    style={{width: 350}}
                    label={"截止时间"}
                    name={"dateTimeLessThanOrEqual"}
                >
                    <DatePicker
                        style={{width:"100%"}}
                        mode={"date"}
                    />
                </Form.Item>
            </Row>
        </Form>
    );
}