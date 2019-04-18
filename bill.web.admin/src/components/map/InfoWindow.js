import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class InfoWindow extends BaseMapComponent {
    constructor(props, context) {
        super(props, context, {
            events: ["close", "open", "clickclose", "maximize", "restore"],
            propKeys: ["style", "title", "content", "enableAutoPan", "enableCloseOnClick", "visible"],
            objectKeys: ["position"]
        });
        this.setMapComponent(new BMap.InfoWindow());
    }

    componentDidMount() {
        this.changeByAllProps();
        this.reOpenOrCloseWindow(this.props);
        this.bindEventListener(this.getEvents());
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
        const {visible, position} = this.props;
        if (nextProps.visible !== this.getMapComponent().isOpen() ||
            nextProps.visible !== visible ||
            JSON.stringify(nextProps.position) !== JSON.stringify(position)) {
            this.reOpenOrCloseWindow(nextProps);
        }
    }

    componentWillUnmount() {
        const {map} = this.props;
        if (this.getMapComponent() && this.getMapComponent().isOpen()) {// 窗口如果还处于打开状态下，需要关闭窗口
            map.closeInfoWindow();
        }
        this.setMapComponent(undefined);
    }

    /**
     * 重新打开或者关闭窗口，当窗口的坐标或者显示状态发生改变时，需要调用此方法。
     * 注：由于百度InfoWindow 没有提供修改坐标的api，所以只能重新打开窗口的方式来修改坐标
     * @param props
     */
    reOpenOrCloseWindow(props) {
        const BMap = global.BMap;
        const {
            map,
            position: {lng, lat}, // 窗口坐标
            visible = false// 打开或者关闭窗口
        } = props;
        if (visible) {
            if (this.getMapComponent().isOpen()) {// 先关闭在显示
                map.closeInfoWindow();
            }
            let point = new BMap.Point(lng, lat);
            map.openInfoWindow(this.getMapComponent(), point);
        } else {
            if (this.getMapComponent().isOpen()) {// 先关闭在显示
                map.closeInfoWindow();
            }
        }
    }

    render() {
        return null;
    }
}
