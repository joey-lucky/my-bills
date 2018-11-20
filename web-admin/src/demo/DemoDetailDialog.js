import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Modal, Row} from "antd";
import {observable} from "mobx";
import * as PropTypes from "prop-types";

/**
 * 简单的对话框，有一个显示和隐藏的属性
 * 1、props.state的出现
 */
// class AppState {
//     @observable visible = true;
//
//     show() {
//         this.visible = true;
//     }
//
//     hide() {
//         this.visible = false;
//     }
// }
//
// @observer
// export default class DemoDetailDialog extends React.Component{
//     static propTypes = {
//         state: PropTypes.object.any,
//     };
//
//     static newState() {
//         return new AppState();
//     }
//
//     render() {
//         let appState = this.props.state;
//         return (
//             <Modal
//                 visible={appState.visible}
//                 maskClosable={false}
//                 onCancel={() => appState.hide()}>
//                 <Form layout="inline">
//                     <Row>
//                         <Col span={12}>
//                             <Form.Item label="代码">测试代码</Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item label="值">测试代码</Form.Item>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Modal>
//         );
//     }
// }

/**
 * 增加data,显示详情
 */
class AppState {
    @observable visible = false;
    @observable data = {};

    show(data) {
        this.visible = true;
        this.data = data;
    }

    hide() {
        this.visible = false;
    }
}

@observer
export default class DemoDetailDialog extends React.Component{
    static propTypes = {
        state: PropTypes.object.any,
    };

    static newState() {
        return new AppState();
    }

    render() {
        let appState = this.props.state;
        return (
            <Modal
                visible={appState.visible}
                maskClosable={false}
                onCancel={() => appState.hide()}>
                <Form layout="inline">
                    <Row>
                        <Col span={12}>
                            <Form.Item label="代码">{appState.data["CODE"]}</Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="值">{appState.data["VALUE"]}</Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
