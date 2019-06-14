import * as React from "react";
import * as styles from "./index.css";
import ToolBar from "./ToolBar";

export default class Home extends React.Component{
    render(){
        return(
            <div className={styles.container}>
                <ToolBar title={"默认账本"}/>
                <h1>首页</h1>
            </div>
        );

    }
}