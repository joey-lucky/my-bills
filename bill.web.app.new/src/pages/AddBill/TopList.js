import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import Text from "@components/Text";
import FontIcon from "@components/FontIcon";
import icons from "@res/icons";
import {observer} from "mobx-react";
import {observable} from "mobx";

@observer
export default class TopList extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
       onItemClick: PropTypes.func.isRequired,
    };

    @observable selectIndex = 0;

    bindOnItemClick = (item, index, array)=>()=>{
        this.selectIndex = index;
        this.props.onItemClick(item, index, array);
    };

    renderItem = (item, index, array) => {
        let isSelected = this.selectIndex === index;
        return (
            <Flex
                key={item}
                style={styles.itemContainer}
                align={"center"}
                justify={"center"}
                onClick={this.bindOnItemClick(item,index,array)}
            >
                <Text
                    style={isSelected && styles.textSelected}
                    text={item}
                    type={"text"}/>
                {
                    isSelected &&
                    <Flex
                        style={styles.iconContainer}
                        justify={"center"}
                        align={"center"}
                    >
                        <FontIcon
                            unicode={icons.xe501}/>
                    </Flex>
                }
            </Flex>
        )
    };

    render() {
        return (
            <Flex
                style={styles.container}
                direction={"row"}
            >
                {
                    this.props.data.map(this.renderItem)
                }
            </Flex>

        )
    }
}

const styles = {
    container: {
        width: "100%",
        height: "1.1rem",
        overflowX: "auto"
    },
    itemContainer: {
        height: "100%",
        position: "relative",
        padding: "0 0.5rem",
    },
    textSelected: {
        color: "#F6A522"
    },
    iconContainer: {
        display: "hide",
        position: "absolute",
        bottom: "2px",
        width: "100%",
        fontSize: "0.2rem",
        color: "#F6A522"
    },

};