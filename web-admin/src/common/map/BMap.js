import * as React from "react";
import * as PropTypes from "prop-types";
import BaseMapComponent from "./BaseMapComponent";

class UUID {
    static randomUUID(len) {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        let uuid = "";
        for (let i = 0; i < len; i++) {
            uuid += chars[0 | Math.random() * chars.length];
        }
        return uuid;
    }
}

class MapScriptUtils {

    /**
     * 下载百度地图Script
     * @param ak
     * @returns Promise
     */
    static downloadBaiDuMapScript = (ak) => {
        let url = document.location.protocol + `//api.map.baidu.com/api?v=3.0&ak=${ak}&callback=_initBMap`;
        global.BMap = global.BMap || {};
        if (Object.keys(global.BMap).length === 0) {
            global.BMap._preloader = new Promise((resolve) => {
                global._initBMap = () => {
                    resolve(global.BMap);
                    global.document.body.removeChild(bMapScriptElement);
                    global.BMap._preloader = null;
                    global._initBMap = null;
                };
                const bMapScriptElement = document.createElement("script");
                bMapScriptElement.src = url;
                global.document.body.appendChild(bMapScriptElement);
            });
            return global.BMap._preloader;
        }
        if (!global.BMap._preloader) {
            return Promise.resolve(global.BMap);
        }
        return global.BMap._preloader;
    };
}

export default class BMap extends BaseMapComponent {
    static propTypes = {
        onMapScriptLoaded: PropTypes.func.isRequired
    };

    _mapId = UUID.randomUUID(16);

    constructor(props, context) {
        super(props, context, {
            events: [
                "click", "dblclick", "rightclick", "rightdblclick", "maptypechange",
                "mouseover", "mouseout", "movestart", "moving", "moveend",
                "zoomstart", "zoomend", "addoverlay", "addcontrol", "removecontrol", "removeoverlay", "clearoverlays",
                "dragstart", "dragging", "dragend", "addtilelayer", "removetilelayer",
                "load", "resize", "hotspotclick", "hotspotover", "hotspotout", "tilesloaded",
                "touchstart", "touchmove", "touchend", "longpress"
            ],
            propKeys: [
                "className", "style",
                "enableDragging", "enableScrollWheelZoom", "enableDoubleClickZoom",
                "enableKeyboard", "enableInertialDragging", "enableContinuousZoom",
                "enablePinchToZoom", "enableAutoResize", "defaultCursor",
                "draggingCursor", "minZoom", "mapStyle",
                "mapStyleV2", "panorama", "center",
                "zoom", "mapType", "viewport", "currentCity"
            ]
        });
    }

    componentDidMount() {
        const {ak} = this.props;
        if (ak) {
            MapScriptUtils.downloadBaiDuMapScript(ak)
                .then((bMap) => {
                    this.onMapScriptLoaded(bMap);
                });
        } else if (global.BMap) {
            this.onMapScriptLoaded(global.BMap);
        } else {
            console.warn("BMap is undefined");
        }
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
    }

    /**
     * 百度地图Script下载成功
     * @param bmap
     */
    onMapScriptLoaded = (bmap) => {

        /*
       * 将百度地图BMap的静态类 copy到当前React组件
       * 长度>2且首字母为大写的BMap静态类 比如BMap.Point
       */
        Object.keys(global)
            .filter(funcName => /^BMAP[_0-9a-zA-Z]+$/.test(funcName))
            .forEach(funcName => BMap[funcName] = global[funcName]);
        Object.keys(bmap)
            .filter(funcName => /^[A-Z][0-9a-zA-Z]{2,}$/.test(funcName))
            .forEach(funcName => BMap[funcName] = bmap[funcName]);

        /*
         * 创建map对象
         */
        let {
            center = new BMap.Point(114.066564, 22.558069),
            zoom = 10
        } = this.props;
        const map = new bmap.Map(this._mapId);
        map.setCurrentCity("深圳市");
        map.centerAndZoom(center, zoom);
        this.setMapComponent(map);

        /*
         * 根据props属性初始化地图
         * 对于特殊的props进行特殊处理
         */
        this.changeByAllProps();
        if (this.props.onMapScriptLoaded) {
            this.props.onMapScriptLoaded();
        } else {
            console.error("BMap props onMapScriptLoaded is undefined,please add props like this <BMap onMapScriptLoaded={()=>{this.forceUpdate()}></BMap>");
        }
    };

    /**
     * 加载子组件，并将map传入到子组件。
     */
    renderChildren() {
        const map = this.getMapComponent();
        if (map) {
            return React.Children.map(this.props.children, (child, index) => {
                let childProps = child.props || {};
                let ChildType = child.type || {};
                return (
                    <ChildType
                        {...childProps}
                        map={map}
                    />
                );
            });
        } else {
            return null;
        }
    }

    render() {
        let mergeStyle = {
            width: "100%",
            height: "100%",
            ...(this.props.style || {})
        };
        return (
            <div
                id={this._mapId}
                style={mergeStyle}
            >
                {
                    this.renderChildren()
                }
            </div>
        );
    }
}
