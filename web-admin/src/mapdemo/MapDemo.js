import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Layout, Row} from "antd";
// import {Ajax} from "../common/unit/ajax";
import BMap from "../common/map/BMap";
import MapTypeControl from "../common/map/MapTypeControl";
import Marker from "../common/map/Marker";
import marker from "./marker.png";
import InfoWindow from "../common/map/InfoWindow";

class AppState {

    /**
     * 成员变量
     * 1、强制：只对需要监听数据变化的变量加@observable前缀
     * 2、强制：成员变量必须包含默认值。
     */
    @observable markers = [];
    @observable infoWindowState = {
        visible: false,
        position: {},
        content: {}
    };

    /**
     * 方法
     * 1、强制：异步请求前缀为async
     * 2、强制：方法名规范，增加使用create,修改使用update,删除使用delete,获取使用get,加载使用load
     * 3、建议：不需要使用箭头函数
     * 4、建议：不直接调用组件或者组件内部的方法，比如：Modal。
     * 5、建议：数据加载前，先清空数据。
     */
    asyncLoadData() {
        Ajax.apiPost("/xxx/xxx/list", {ID: "xxxx"})
            .then((d) => {
                let data = d.data || [];
                this.markers = data.map((item) => {
                    item.icon = new BMap.Icon(marker, new BMap.Size(26, 23));
                    item.position = new BMap.Point(item.lng, item.lat);
                    return item;
                });
            });
    }

    showMarker(item) {
        this.infoWindowState.content = item.content;
        this.infoWindowState.position = item.position;
        this.infoWindowState.visible = true;
    }
}

/**
 * 地图组件的使用完全参照百度地图api。
 * set开头的api
 * setTitle 对应的props title
 * setContent 对应的props content
 *
 * enable或者disable开头的api
 * enableMaximize对应的props enableMaximize 类型是boolean
 *
 * 通过修改对应的props，底层会自动去调用指定的api
 *
 * 地图事件，
 * 对应的props eventListener
 * 包含的事件列表详见百度地图api，完全一致。
 */
@observer
export default class MapDemo extends React.Component {
    static propTypes = {};

    _appState = new AppState();
    _columns = [
        {
            title: "代码",
            dataIndex: "CODE",
            key: "CODE"
        },
        {
            title: "值",
            dataIndex: "VALUE",
            key: "VALUE"
        }];

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    /**
     * 强制：必须监听地图Script是否加载（懒加载设计），加载完成后，刷新界面。
     * 可以通过this.forceUpdate()活着this.setState()等方法刷新
     */
    onMapScriptLoaded=() => {
        this.forceUpdate();
        this._appState.asyncLoadData();
    };

    onMarkerClick=(item) => {
        this._appState.showMarker(item);
    };

    /**
     * BMap内部类，完全参照百度地图Api
     * 比如BMap.Point
     */
    onAddClick=() => {
        let addMarker = {
            lng: 113.804304 + Math.random() * 0.6,
            lat: 22.532142 + Math.random() * 0.6,
            content: "这是手动添加的辆汽车"
        };
        addMarker.icon = new BMap.Icon(marker, new BMap.Size(26, 23));
        addMarker.position = new BMap.Point(addMarker.lng, addMarker.lat);
        this._appState.markers.push(addMarker);
    };

    render() {
        const {markers} = this._appState;
        console.log([BMap.BMAP_NORMAL_MAP, BMap.BMAP_PERSPECTIVE_MAP, BMap.BMAP_SATELLITE_MAP]);
        return (
            <Layout style={{height: "100%"}}>
                <Row style={{margin: 12}}>
                    <Button type="primary" onClick={this.onAddClick}>添加</Button>
                </Row>
                <BMap
                    style={{width: "100%", height: "100%"}}
                    ak="yWoMvx2Mhp18XGLRRggWbMdu"
                    enableScrollWheelZoom
                    zoom={11}
                    onMapScriptLoaded={() => {
                        this.forceUpdate();
                    }}
                >
                    <MapTypeControl
                        type={BMap.BMAP_MAPTYPE_CONTROL_HORIZONTAL}
                        mapTypes={[BMap.BMAP_NORMAL_MAP, BMap.BMAP_PERSPECTIVE_MAP, BMap.BMAP_SATELLITE_MAP]}
                    />
                    <InfoWindow
                        title="车辆信息"
                        style={{width: 200, height: 100}}
                        visible={this._appState.infoWindowState.visible}
                        content={this._appState.infoWindowState.content}
                        position={this._appState.infoWindowState.position}
                    />
                    {
                        markers.map((item, index) =>
                            <Marker
                                key={index}
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

            </Layout>
        );
    }
}

/**
 * 模拟网络数据，实际无用
 */
const Ajax = {
    apiPost: () => new Promise((resolve) => {
        let data = [];
        let size = parseInt(Math.random() * 10 + 1, 10);
        for (let i = 0; i < size; i++) {
            data.push({
                lng: 113.804304 + Math.random() * 0.6,
                lat: 22.532142 + Math.random() * 0.6,
                content: "这是第" + i + "辆汽车"
            });
        }
        let d = {data: data};
        setTimeout(() => {
            resolve(d);
        }, 800);
    })
};

