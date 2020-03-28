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
    _mapId = UUID.randomUUID(16);

    static childContextTypes = {
        map: PropTypes.any,
    };

    static Size = function Size(width, height) {
        this.width = width;
        this.height = height;
        this.toBMapObject = () => new BMap.REPEAT_Size(this.width, this.height);
    };

    static Icon = function Icon(src, size) {
        this.src = src;
        this.size = size;
        this.toBMapObject = () => {
            let size = (this.size && this.size.toBMapObject()) || undefined;
            return new BMap.REPEAT_Icon(this.src, size);
        };
    };

    static Point = function Point(lng, lat) {
        this.lng = lng;
        this.lat = lat;
        this.toBMapObject = () => new BMap.REPEAT_Point(this.lng, this.lat);
    };

    // static Label = function Label(content, opts = {}) {
    //     this.content = content;
    //     this.opts = opts;
    //     this.toBMapObject = () => {
    //         let newOpts = {};
    //         for (let key of Object.keys(this.opts)) {
    //             if (this.opts[key].toBMapObject) {
    //                 newOpts[key] = this.opts[key].toBMapObject();
    //             }
    //         }
    //         return new BMap.REPEAT_Label(this.content, newOpts);
    //     };
    // };

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
                "draggingCursor", "minZoom", "mapStyle","mapStyleV2",
                "mapStyleV2", "panorama", "center",
                "zoom", "mapType", "viewport", "currentCity"
            ]
        });
        this.state = {
            map: null
        };
    }

    getChildContext() {
        return {
            map: this.state.map
        };
    }

    componentDidMount() {
        // const {ak} = this.props;
        // if (ak) {
        //     MapScriptUtils.downloadBaiDuMapScript(ak)
        //         .then((bMap) => {
        //             this.onMapScriptLoaded(bMap);
        //         });
        // } else if (global.BMap) {
        //     this.onMapScriptLoaded(global.BMap);
        // } else {
        //     console.warn("BMap is undefined");
        // }
        this.onMapScriptLoaded(global.BMap);
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
    }

    /**
     * 百度地图Script下载成功
     * @param BaiduMap
     */
    onMapScriptLoaded = (BaiduMap) => {

        /*
       * 将百度地图BMap的静态类 copy到当前React组件
       * 长度>2且首字母为大写的BMap静态类 比如BMap.Point
       */
        let bMapKeySet = new Set(Object.keys(BMap));
        Object.keys(BaiduMap)
            .filter(funcName => /^[A-Z][0-9a-zA-Z]{2,}$/.test(funcName))
            .forEach((funcName) => {
                if (bMapKeySet.has(funcName)) {// 已存在的对象
                    BMap["REPEAT_" + funcName] = BaiduMap[funcName];
                } else {
                    BMap[funcName] = BaiduMap[funcName];
                }
            });

        /*
         * 创建map对象
         */
        let {
            center = new BMap.Point(114.066564, 22.558069).toBMapObject(),
            zoom = 10
        } = this.props;
        const map = new BaiduMap.Map(this._mapId);
        map.setCurrentCity("深圳市");
        map.centerAndZoom(center, zoom);
        this.setMapComponent(map);

        /*
         * 根据props属性初始化地图
         * 对于特殊的props进行特殊处理
         */
        this.setState({map});
        this.changeByAllProps();
        this.bindEventListener(this.getEvents());
        this.props.onMapScriptLoaded && this.props.onMapScriptLoaded(BaiduMap);
    };

    /**
     * 加载子组件，并将map传入到子组件。
     */
    renderChildren() {
        const map = this.getMapComponent();
        if (map) {
            return this.props.children;
        } else {
            return null;
        }
    }

    render() {
        let mergeStyle = {
            width: "100%",
            height: "100%",
            position: "relative",
            ...(this.props.style || {})
        };
        return (
            <div
                id={this._mapId}
                style={mergeStyle}
            >
                {this.renderChildren()}
            </div>
        );
    }
}
