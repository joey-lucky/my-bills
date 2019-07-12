import * as React from "react";
import {observable} from "mobx";
import {addBillApi} from "../../services/api";
import {Flex} from "antd-mobile";
import fontSizes from "@res/fontSizes";
import colors from "@res/colors";

class AppState {
    @observable data = [];

    asyncloadData(){
        addBillApi.getBillTemplateList().then(d=>{
            this.data = d.data||[];
        });
    }

}


export default class TemplateList extends React.Component {
    _appState = new AppState();

    render(){
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                {
                    this._appState.data.map(item=>{

                    })

                }

            </Flex>

        );
    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
};