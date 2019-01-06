import React from "react";
import PropTypes from "prop-types";
import {Checkbox, Col, Row} from "antd";

export default class GroupCarCheckBox extends React.Component {
    static propTypes = {
        cars: PropTypes.any,
        onChange: PropTypes.any,
        groupName: PropTypes.any
    };

    constructor(props) {
        super(props);
        const {cars} = this.props;

        let selectedCars = [];

        cars.forEach((item, index) => {
            selectedCars.push(item.ID);
        });

        this.state = {
            show: "block",
            selectedCars: selectedCars
        };
    }

    /**
     * checkBox点击事件，控制选中效果
     */
    onCarChange(values) {
        const {onChange} = this.props;

        if (onChange) {
            onChange(values);
        }

        this.setState({
            selectedCars: values
        });
    }

    /**
     * 全选控制
     */
    onCheckAllChange(value) {
        const {cars, onChange} = this.props;

        let selectedCars = [];

        if (value.target.checked) {
            cars.forEach((item, index) => {
                selectedCars.push(item.ID);
            });
        }

        if (onChange) {
            onChange(selectedCars);
        }

        this.setState({
            selectedCars: selectedCars
        });
    }

    /**
     * 标题点击事件，控制下拉效果
     */
    onTitleClick() {
        let {show} = this.state;
        if (show === "block") {
            show = "none";
        } else {
            show = "block";
        }
        this.setState({
            show: show
        });
    }

    render() {

        const state = this.state;
        const {groupName, cars} = this.props;

        return (
            <div style={{width: "100px"}} key={groupName}>
                <div onClick={() => this.onTitleClick()}>
                    <Checkbox
                        value={groupName} defaultChecked
                        onChange={value => this.onCheckAllChange(value)}
                    >{groupName}</Checkbox>
                </div>
                <div style={{display: state.show}}>
                    <Checkbox.Group
                        onChange={values => this.onCarChange(values)}
                        value={state.selectedCars}
                    >
                        {
                            cars.map((car, index) => <Row key={car.ID}>
                                <Col offset="4" span="24">
                                    <Checkbox value={car.ID}>{car.CAR_NO}</Checkbox>
                                </Col>
                            </Row>)
                        }
                    </Checkbox.Group>
                </div>
            </div>);

    }
}
