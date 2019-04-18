import {Col, Modal, Row} from "antd";
import {observer} from "mobx-react";
import * as React from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {publicPath} from "@global";
import routes from "./routes";
import {createBrowserHistory} from "history";
import Intro from "./components/Intro";
import Footer from "./components/Footer";

@observer
export default class App extends React.Component {
    _history = createBrowserHistory({basename: publicPath});

    render() {
        return (
            <Router history={this._history}>
                <div style={styles.container}>
                    <Row
                        style={styles.row}
                    >
                        <Col span={12}>
                            <Intro/>
                        </Col>
                        <Col span={12}>
                            <div style={styles.form}>
                                <Switch>
                                    {
                                        routes.map((item, index) => (
                                            <Route
                                                key={index}
                                                path={item.path}
                                                component={item.component}
                                            />
                                        ))
                                    }
                                    <Redirect to={routes[0].path}/>
                                </Switch>
                            </div>
                        </Col>
                    </Row>
                    <Footer/>
                </div>
            </Router>
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

