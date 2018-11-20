import React from "react";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Col, Form, Input, Modal, Row} from "antd";
import {observable} from "mobx";
import {Ajax} from "../../../unit/ajax";

// 默认左右两边的form item
const FormItem = ({label = "", children, labelCol = {span: 8}, wrapperCol = {span: 16}}) => (
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

class AppState {
    @observable data = {};
    @observable visible = false;
    @observable confirmLoading = false;

    show = () => {
        this.visible = true;
        this.confirmLoading = false;
    };

    hide = () => {
        this.visible = false;
        this.confirmLoading = false;
    };
}

const AlarmRangeEdit = ({form, state}) => {
    // 装饰器
    const getFieldDecorator = (id, options = {}) => {
        options.initialValue = state.data[id];
        return form.getFieldDecorator(id, options);
    };
    const labelSpan = {
        span: 8
    };
    const fieldSpan = {
        span: 16
    };
    return (
        <Form layout="inline" style={{width: "100%"}}>
            <Row>
                <Col span={11}>
                    <FormItem label="所属站点">
                        {state.data.SITE_NAME}
                    </FormItem>
                </Col>
                <Col span={11} offset={2}>
                    <FormItem label="参数名称">
                        {state.data.POLL_NAME}
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span={10}>
                    <FormItem label="超标范围" labelCol={labelSpan} wrapperCol={fieldSpan}>
                        {getFieldDecorator("DENSITY_LIMIT_DOWN")(<Input/>)}
                    </FormItem>
                </Col>
                <Col span={1}> - </Col>
                <Col span={10}>
                    <FormItem label="" labelCol={0} wrapperCol={fieldSpan}>
                        {getFieldDecorator("DENSITY_LIMIT_UP")(<Input/>)}
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span={10}>
                    <FormItem label="排放量范围" labelCol={labelSpan} wrapperCol={fieldSpan}>
                        {getFieldDecorator("EMIS_LIMIT_DOWN")(<Input/>)}
                    </FormItem>
                </Col>
                <Col span={1}> - </Col>
                <Col span={10}>
                    <FormItem label="" labelCol={labelSpan} wrapperCol={fieldSpan}>
                        {getFieldDecorator("EMIS_LIMIT_UP")(<Input/>)}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
};
AlarmRangeEdit.propTypes = {
    form: PropTypes.any,
    state: PropTypes.any
};

@observer
class AlarmRangeEditDialog extends React.Component {
    static propTypes = {
        onSuccess: PropTypes.any,
        state: PropTypes.any,
        onError: PropTypes.any,
        form: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    saveData = (value) => {
        const {state, onSuccess, onError} = this.props;
        const {SITE_ID, POLL_CODE, DENSITY_ID, EMIS_ID} = state.data;
        let densityData = {SITE_ID, POLL_CODE, LIMIT_DOWN: value.DENSITY_LIMIT_DOWN, LIMIT_UP: value.DENSITY_LIMIT_UP};
        let emisData = {SITE_ID, POLL_CODE, LIMIT_DOWN: value.EMIS_LIMIT_DOWN, LIMIT_UP: value.EMIS_LIMIT_UP};

        let postDensity;
        let postEmis;
        if (DENSITY_ID) {
            densityData = {...densityData, ID: DENSITY_ID};
            postDensity = Ajax.apiPost("/systemmanager/alarmsetting/alarm/polldensity/update", densityData);
        } else {
            postDensity = Ajax.apiPost("/systemmanager/alarmsetting/alarm/polldensity/create", densityData);
        }
        if (EMIS_ID) {
            emisData = {...emisData, ID: EMIS_ID};
            postEmis = Ajax.apiPost("/systemmanager/alarmsetting/alarm/pollemis/update", emisData);
        } else {
            postEmis = Ajax.apiPost("/systemmanager/alarmsetting/alarm/pollemis/create", emisData);
        }
        Promise.all([postDensity, postEmis])
            .then((values) => {
                state.hide();
                onSuccess && onSuccess(JSON.stringify(values));
            })
            .catch((msg) => {
                state.hide();
                onError && onError(msg);
            });
    };

    getFieldDecorator = (id, options = {}) => {
        const appState = this.props.state;
        options.initialValue = appState.data[id];
        return this.props.form.getFieldDecorator(id, options);
    };

    handleOnOkClick = () => {
        const {state} = this.props;
        state.confirmLoading = true;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.saveData(values);
            }
        });
    };

    handleOnCancelClick = () => {
        const appState = this.props.state;
        appState.hide();
    };

    render() {
        const {state} = this.props;
        return (
            <Modal
                title="设置范围"
                okText="保存"
                cancelText="取消"
                width={750}
                style={{top: 20}}
                destroyOnClose
                maskClosable={false}
                visible={state.visible}
                onOk={this.handleOnOkClick}
                confirmLoading={state.confirmLoading}
                onCancel={this.handleOnCancelClick}
            >
                <AlarmRangeEdit {...this.props}/>
            </Modal>
        );
    }
}

export default Form.create()(AlarmRangeEditDialog);
