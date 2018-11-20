import * as React from "react";

import {Button} from "antd";

export default class TestManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    render() {
        return (
            <div>
                <h1>测试生命周期</h1>
                <Button
                    onClick={() => {
                        this.setState({show: !this.state.show});
                    }}
                >提交</Button>
            </div>
        );
    }
}

