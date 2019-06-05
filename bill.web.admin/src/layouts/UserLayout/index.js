import * as React from "react";
import {Col, Row} from "antd";
import Intro from "./components/Intro";
import Footer from "./components/Footer";
import UserLogin from "../../pages/UserLogin";


export default class UserLayout extends React.Component{
    render(){
        return (
            <div style={styles.container}>
                <Row
                    style={styles.row}
                >
                    <Col span={12}>
                        <Intro/>
                    </Col>
                    <Col span={12}>
                        <div style={styles.form}>
                            <UserLogin/>
                        </div>
                    </Col>
                </Row>
                <Footer/>
            </div>
        );
    }
}

const styles = {
    container: {
        position: 'relative',
        width: '100wh',
        minWidth: '1200px',
        height: '100vh',
        backgroundImage:
            'url(https://img.alicdn.com/tfs/TB1Dc9.zFYqK1RjSZLeXXbXppXa-2704-1790.png)',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1',
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};