import React from "react";
import {Redirect, Route, Router} from "react-router-dom";
import {Flex, LocaleProvider, Toast} from "antd-mobile";
// import {publicPath} from "./global";
import routes from "./routes";
import createHashHistory from "history/createHashHistory";
import {setErrorHander} from "@utils/request";


let history = createHashHistory({
    // forceRefresh:false,
    // hashType:"hashbang",
    basename: "/"
});

function fullScreen() {
    let ele = document.body;
    if (ele.requestFullscreen) {
        ele.requestFullscreen().catch((error)=>{console.log(error)});
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    }
}

export default class App extends React.Component {
    constructor(props,context){
        super(props,context);
        setErrorHander((e)=>{
            if (e.message.indexOf("token") !== -1) {
                history.push("/login");
            }
        });
    }

    render() {
        Toast.SHORT = 1;
        const {match} = this.props;
        return (
            <LocaleProvider >
                <Router history={history}>
                    <div style={styles.container}>
                        <div style={styles.contentContainer}>
                            {
                                routes.map(item=>
                                    <Route
                                        key={item.path}
                                        path={item.path}
                                        component={item.component}
                                    />
                                )
                            }
                            {/*<Redirect to={"/home"}/>*/}
                        </div>
                        {/*<Flex*/}
                            {/*onClick={()=>{*/}
                                {/*fullScreen();*/}
                                {/*styles.fullScreenContainer.display = "none";*/}
                            {/*}}*/}
                            {/*style={styles.fullScreenContainer}*/}
                            {/*justify={"center"}*/}
                            {/*align={"center"}*/}
                        {/*>*/}
                            {/*进入全屏*/}
                        {/*</Flex>*/}
                    </div>
                </Router>
            </LocaleProvider>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        position: "relative"
    },
    contentContainer: {
        top:0,
        left:0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        position: "absolute"
    },
    fullScreenContainer: {
        top:0,
        left:0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        color:"#FFFFFF",
        position: "absolute",
        zIndex:999,
    },
};