import * as React from "react";
import * as styles from "./index.css";
import BottomIcon from "@pages/Home/BottomBar/BottomIcon";

export default class BottomBar extends React.Component{


    render(){
        return(
            <div className={styles.container}>
                <BottomIcon title={"账户"} unicode={"&#xe604;"}/>
                <BottomIcon title={"流水"} unicode={"&#xe604;"}/>
                <div className={styles.center}>记一笔</div>
                <BottomIcon title={"账户"} unicode={"&#xe604;"}/>
                <BottomIcon title={"账户"} unicode={"&#xe604;"}/>
            </div>
        );
    }
}