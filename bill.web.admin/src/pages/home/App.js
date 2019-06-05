import {Layout, Row} from "antd";
import {observer} from "mobx-react";
import * as React from "react";
import {Router} from "react-router-dom";
import {publicPath} from "@global";
import {createBrowserHistory} from "history";
import RouteContent from "@components/routes/RouteContent";
import routes from "./routes"
import LeftMenu from "./components/LeftMenu";
import Header from "./components/Header";

const {Sider, Content} = Layout;

@observer
export default class App extends React.Component {
    _history = createBrowserHistory({basename: publicPath + "/home"});

    render() {
        return (
            <Router history={this._history}>
                <Layout style={styles.container}>
                    <div style={styles.leftMenu}>
                        <LeftMenu value={routes}/>
                    </div>
                    <div style={styles.rightContent}>
                        <div
                            style={styles.header}
                        >
                        </div>
                        <div style={styles.rightRouteContent}>
                            {
                                <RouteContent
                                    childRouteData={routes}
                                    defaultRouteIndex={0}
                                />
                            }
                        </div>
                    </div>
                </Layout>
            </Router>
        );
    }
}

const styles = {
    container: {
        width: '100wh',
        minWidth: '1200px',
        height: '100vh',
        display:"flex",
        flexDirection:"row",
    },
    leftMenu:{
        display:"block",
        width:200,
        height: "100%",
    },
    rightContent:{
        display:"flex",
        width:0,
        height:"100%",
        flex:1,
        flexDirection: "column"
    },
    rightRouteContent:{
        display:"block",
        height:0,
        width: "100%",
        flex:1,
    },
    header:{
        width:"100%",
        height: 64,
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        backgroundColor:"white",
        boxSizing:"border-box"
    }
};

