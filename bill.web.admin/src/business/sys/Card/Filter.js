import {Button, Col, Form, Input, Row, Space} from "antd";
import React from "react";
import {RemoteSelect} from "@components";
import {cardTypeAPI, userAPI} from "@services";

export default function Filter({onFinish,onCreateClick}) {
    return (
        <Form
            style={{width: "100%"}}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            layout={"inline"}
            onFinish={onFinish}
        >
            <Row>
                <Col span={8}>
                    <Form.Item
                        style={{width: 250}}
                        label={"关键字"}
                        name={"keyword"}
                    >
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label={"用户"}
                        name={"userId"}
                    >
                        <RemoteSelect
                            extraOptions={[{id: "", name: "全部"}]}
                            loadData={userAPI.index}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label={"银行卡类型"}
                        name={"cardTypeId"}
                    >
                        <RemoteSelect
                            extraOptions={[{id: "", name: "全部"}]}
                            loadData={cardTypeAPI.index}
                        />
                    </Form.Item>
                </Col>
                <Space>
                    <Button type={"primary"} htmlType={"submit"}>查询</Button>
                    <Button type={"primary"} onClick={onCreateClick}>新增</Button>
                </Space>
            </Row>
        </Form>
    );
}