import * as React from "react";
import {Flex} from "antd-mobile";
import ToolBar from "@components/ToolBar";
import SlideShow from "@components/SlideShow";
import CardList from "@pages/Assert/CardList";
import {Divider} from "@components/Divider";

class AppState {


    asyncLoadData(){

    }
}

export default class Assert extends React.Component {

    onAddClick = (event) => {
        event.stopPropagation();
    };


    renderDivider(){
        return (
            <Divider
                direction={"row"}
                size={"0.1rem"}
                colorType={"light"}
            />
        );
    }

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"column"}
            >
                <ToolBar
                    title={"账户"}
                    showAdd={true}
                    onAddClick={this.onAddClick}
                />
                <Flex
                    style={styles.content}
                    justify={"start"}
                    align={"start"}
                    direction={"column"}
                >
                    <SlideShow
                        title={"净资产"}
                        money={"109.69"}
                        label1={"资产"}
                        value1={"7700.65"}
                        label2={"负债"}
                        value2={"109.65"}
                    />
                    <CardList/>
                    {this.renderDivider()}
                    <CardList/>
                    {this.renderDivider()}
                    <CardList/>
                    {this.renderDivider()}
                    <CardList/>
                </Flex>
            </Flex>
        );

    }
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    content: {
        height: 0,
        width: "100%",
        flex:1,
        overflowY: "auto"
    }
};