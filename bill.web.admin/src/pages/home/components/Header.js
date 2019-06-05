import * as React from "react";
import {Row} from "antd";


export default class Header extends React.Component {
    render() {
        const {location = {}} = this.props;
        return (
            <Row
                style={styles.container}
                type={"type"}
            >
            </Row>
        );
    }
}


const styles = {
    container: {
        height: 64,
        boxShadow: "2px 0 6px rgba(0,21,41,.35)",
        backgroundColor:"white"
    }


};