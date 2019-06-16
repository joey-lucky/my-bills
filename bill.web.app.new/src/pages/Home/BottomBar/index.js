import * as React from "react";
import * as styles from "./index.css";
import BottomIcon from "@pages/Home/BottomBar/BottomIcon";
import FontIcon from "@components/FontIcon";

export default class BottomBar extends React.Component{


    render(){
        return(
            <div className={styles.container}>
                <BottomIcon title={"账户"} unicode={FontIcon.icons.bottomBar[0]}/>
                <BottomIcon title={"流水"} unicode={FontIcon.icons.bottomBar[1]}/>
                <div className={styles.center}>记一笔</div>
                <BottomIcon title={"投资"} unicode={FontIcon.icons.bottomBar[2]}/>
                <BottomIcon title={"设置"} unicode={FontIcon.icons.bottomBar[3]}/>
            </div>
        );
    }
}