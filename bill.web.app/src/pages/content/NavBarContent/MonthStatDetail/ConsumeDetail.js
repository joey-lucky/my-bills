import * as React from "react";
import {Card, Flex} from "antd-mobile";
import TotalPieChart from "./TotalPieChart";

export default  class ConsumeDetail extends React.Component{
    render(){
        return (
            <Flex
                style={{width: "100%"}}
                direction={"column"}>

                <Card style={{width:"95%",marginTop:"1rem"}}>
                    <Card.Header title={"汇总"}/>
                    <Card.Body>
                        <TotalPieChart value={this.props.value.total}/>
                    </Card.Body>
                </Card>
            </Flex>
        );
    }
}