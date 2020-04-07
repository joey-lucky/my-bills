import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row,DatePicker} from "antd";
import {FormDialog, RemoteSelect} from "@components";
import {billTypeAPI, cardAPI, userAPI} from "@services";
import moment from "moment";

const cardLoadData = (...args) => {
    return cardAPI.index(...args).then(d=>{
        let data = d.data || [];
        data.sort((a, b) => a.userName.localeCompare(b.userName));
        return d;
    });
};
@observer
export default class EditDialog extends FormDialog {
    static propTypes = FormDialog.propTypes;

    static defaultProps = {
        width: 950,
        labelCol: {span: 6},
        wrapperCol: {span: 18}
    };

    beforeShow(data={}){
        if (data.dateTime) {
            data.dateTime = moment(data.dateTime);
        }
        return data;
    }

    beforeSubmit(values){
        if (values.dateTime) {
            values.dateTime = values.dateTime.format("YYYY-MM-DD 00:00:00");
        }
        return values;
    }
    renderForm() {
        return (
            <React.Fragment>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="描述"
                            name={"billDesc"}
                            rules={[{required: true}]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="金额"
                            name={"money"}
                            rules={[{required: true}]}
                        >
                            <Input type={"number"}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="账单类型"
                            name={"billTypeId"}
                        >
                            <RemoteSelect loadData={billTypeAPI.index}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="用户"
                            name={"userId"}
                            rules={[{required: true}]}
                        >
                            <RemoteSelect loadData={userAPI.index}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="银行卡"
                            name={"cardId"}
                        >
                            <RemoteSelect
                                loadData={cardLoadData}
                                parse={(item) => ({id: item.id, name: item.userName + " - " + item.name})}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="目标银行卡"
                            name={"targetCardId"}
                        >
                            <RemoteSelect
                                loadData={cardLoadData}
                                parse={(item) => ({id: item.id, name: item.userName + " - " + item.name})}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="日期"
                            name={"dateTime"}
                            rules={[{required: true}]}
                        >
                            <DatePicker
                                format={"YYYY年MM月DD日"}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

