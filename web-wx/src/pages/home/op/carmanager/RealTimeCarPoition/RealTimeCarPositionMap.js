import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button} from "antd";
import * as styles from "./RealTimeCarPoitionMap.css";
import {Ajax} from "@utils/ajax";
import CarSelecter from "./CarSelecter";
import BMap from "../map/BMap";
import Marker from "../map/Marker";
import InfoWindow from "../map/InfoWindow";
import MapTypeControl from "../map/MapTypeControl";
import carRunIcon from "./car_run.png";
import carStopIcon from "./car_stop.png";


class AppState {
    @observable data = [];

    @observable markerList = [];

    @observable infoWindowOption = {
        position: {},
        visible: false,
        content: ""
    };
}

@observer
export default class RealTimeCarPositionMap extends React.Component {
    static newState() {
        return new AppState();
    }

    _appState = new AppState();

    /**
     * 选择的车辆
     */
    _selectedCars = [];

    renderCar(carInfos) {
        this._appState.infoWindowOption.visible = false;
        this._appState.markerList = [];
        this._selectedCars = carInfos;
        let carApiObj = "";
        carInfos.forEach((carId, index) => {
            carApiObj += carId + ",";
        });
        carApiObj = carApiObj.substring(0, carApiObj.length - 1);
        let queryObj = {
            veh_list: "[" + carApiObj + "]"
        };
        this._appState.markerList = [];
        Ajax.apiPost("/op/carmanager/car/get-last-car-gps-data", queryObj)
            .then((d) => {
                let data = d.data || [];
                this._appState.markerList = data.map((item, index) => {
                    let lng = item.LNG;
                    let lat = item.LAT;
                    let carId = item.CAR_ID;
                    let carNo = item.PLATE;
                    let engineStatus = item.ENGINE_STATUS;
                    let iconName = engineStatus === "1" ? carRunIcon : carStopIcon;
                    let icon = new BMap.Icon(iconName, new BMap.Size(26, 23));
                    let point = new BMap.Point(lng, lat);
                    return {
                        engineStatus: engineStatus,
                        carId: carId,
                        icon: icon,
                        position: point,
                        carNo: carNo
                    };
                });
            });
    }

    /**
     * 车辆刷新按钮
     */
    onCarRefreshClick() {
        this.renderCar(this._selectedCars);
    }

    onMarkerClick = (item) => {
        console.log("onMarkerClick");
        let {carNo, engineStatus, position} = item;
        let geocoder = new BMap.Geocoder();
        geocoder.getLocation(position, (rs) => {
            console.log(rs);
            let addComp = rs.addressComponents;
            let address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            let carStatus = engineStatus === "1" ? "行驶中" : "未发动";
            let content = (
                <table>
                    <tr>
                        <td>位置：</td>
                        <td>{address}</td>
                    </tr>
                    <tr>
                        <td>车牌：</td>
                        <td>{carNo}</td>
                    </tr>
                    <tr>
                        <td>状态：</td>
                        <td>{carStatus}</td>
                    </tr>
                </table>
            );
            this._appState.infoWindowOption = {
                position: item.position,
                visible: true,
                content: this.toHtmlString(content)
            };
        });
    };

    toHtmlString(reactNode) {
        let {type} = reactNode;
        let {children, ...props} = reactNode.props;
        let propsStr = "";
        Object.keys(props).forEach((propName) => {
            let propValue = props[propName] || "";
            if (propName === "className") {
                propsStr += ` class="${JSON.stringify(propValue)}"`;
            } else {
                propsStr += ` ${propName}="${JSON.stringify(propValue)}"`;
            }
        });
        if (typeof children === "string") {
            return `<${type}${propsStr}>${children}</${type}>`;
        } else if (Array.isArray(children)) {
            let childStr = "";
            React.Children.forEach(children, (child, index) => {
                childStr += this.toHtmlString(child);
            });
            return `<${type}${propsStr}>${childStr}</${type}>`;
        } else {
            let childStr = this.toHtmlString(children);
            return `<${type}${propsStr}>${childStr}</${type}>`;
        }
    }

    render() {
        const state = this._appState;
        return (
            <div className="fill-parent">
                <BMap
                    ak={"yWoMvx2Mhp18XGLRRggWbMdu"}
                    enableScrollWheelZoom
                    zoom={11}
                >
                    <MapTypeControl
                        type={global.BMAP_MAPTYPE_CONTROL_HORIZONTAL}
                        mapTypes={[global.BMAP_NORMAL_MAP, global.BMAP_PERSPECTIVE_MAP, global.BMAP_SATELLITE_MAP]}
                    />
                    <InfoWindow
                        title="车辆信息"
                        style={{width: 200, height: 100}}
                        visible={state.infoWindowOption.visible}
                        content={state.infoWindowOption.content}
                        position={state.infoWindowOption.position}
                    />
                    {
                        state.markerList.map((item, index) =>
                            <Marker
                                key={item.carId}
                                icon={item.icon}
                                position={item.position}
                                eventListener={{
                                    "click": (event) => {
                                        this.onMarkerClick(item);
                                    }
                                }}
                            />
                        )
                    }
                </BMap>
                <CarSelecter
                    onCarSelected={carInfos => this.renderCar(carInfos)}
                />
                <Button
                    className={styles.tool_right}
                    size="small"
                    onClick={() => this.onCarRefreshClick()}
                >刷新</Button>
            </div>
        );
    }
}
