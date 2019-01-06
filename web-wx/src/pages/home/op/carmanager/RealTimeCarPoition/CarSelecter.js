import React from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import * as styles from "./CarSelecter.css";
import GroupCarCheckBox from "./GroupCarCheckBox";
import {Ajax} from "@utils/ajax";

@observer
export default class CarSelecter extends React.Component {
    static propTypes = {
        onCarSelected: PropTypes.any
    };

    _getCarListPromise;

    /**
     * 选中的车，按组存放
     */
    _selectedCars = {};

    constructor(props) {
        super(props);
        this.state = {
            carListShow: "none",
            defaultValue: [],
            groupCars: {},
            data: []
        };
        this.getCarList();
    }

    componentWillUnmount() {
        if (this._getCarListPromise) {
            this._getCarListPromise.cancel("组件卸载");
        }
    }

    onTitleClick() {
        let carListShow = this.state.carListShow;

        if (carListShow === "none") {
            carListShow = "block";
        } else {
            carListShow = "none";
        }

        this.setState({
            carListShow: carListShow
        });

    }

    onCarChange(groupName, cars) {
        const {onCarSelected} = this.props;
        this._selectedCars[groupName] = cars;
        let selectedCars = [];
        Object.keys(this._selectedCars).forEach((item) => {
            let groupCars = this._selectedCars[item] || [];
            selectedCars = [...selectedCars, ...groupCars];
        });
        onCarSelected(selectedCars);
    }

    getCarList() {
        const {onCarSelected} = this.props;
        let me = this;

        /**
         * 把数据按运维组分组存放
         */
        let groupCars = {};

        this._getCarListPromise = Ajax.apiPost("/op/carmanager/car/list-model", null)
            .then((d) => {

                let data = d.data || [];

                let defaultValues = [];

                /**
                 * 处理两件事
                 * 1、把所有车辆加入默认选中项里
                 * 2、把车辆按运维组分组
                 */
                data.forEach((item, index) => {
                    defaultValues.push(item.ID);

                    // let groupId = item.GROUP_ID;
                    let groupName = item.GROUP_ID_DESC;

                    if (!groupName) {
                        groupName = "未分组";
                    }

                    if (!groupCars[groupName]) {
                        groupCars[groupName] = [];
                    }

                    groupCars[groupName].push(item);

                });

                me.setState({
                    data: data,
                    defaultValue: defaultValues,
                    groupCars: groupCars
                });

                if (onCarSelected) {
                    onCarSelected(defaultValues);
                }

            });
    }

    render() {
        const state = this.state;

        if (state.data.length === 0) {
            return <div/>;
        }

        let groups = Object.keys(state.groupCars);

        return (
            <div className={styles.tool_body}>
                <div className={styles.tool_title} onClick={() => this.onTitleClick}>辆车列表</div>
                <div style={{display: state.carListShow}} className={styles.tool_car_list}>
                    {
                        groups.map((groupName, index) =>
                            <GroupCarCheckBox
                                key={index}
                                groupName={groupName}
                                onChange={cars => this.onCarChange(groupName, cars)}
                                cars={state.groupCars[groupName]}
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}
