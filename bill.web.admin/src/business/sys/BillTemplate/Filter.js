import {Button, Form, Input, Row, Space} from "antd";
import React from "react";
import {RemoteSelect} from "@components";
import {billTypeAPI, cardAPI} from "@services";

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
            <Row style={{width: "100%",padding:"12px 0"}}>
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
                    <RemoteSelect
                        extraOptions={[{id: "", name: "全部"}]}
                        loadData={billTypeAPI.index}
                    />
                </Form.Item>
                <Form.Item
                    style={{width: 350}}
                    label={"银行卡"}
                    name={"cardId"}
                >
                    <RemoteSelect
                        extraOptions={[{id: "", name: "全部"}]}
                        loadData={cardLoadData}
                        parse={(item) => ({id: item.id, name: item.userName + " - " + item.name})}
                    />
                </Form.Item>
                <Space>
                    <Button type={"primary"} htmlType={"submit"}>查询</Button>
                    <Button type={"primary"} onClick={onCreateClick}>新增</Button>
                </Space>
            </Row>
        </Form>
    );
}