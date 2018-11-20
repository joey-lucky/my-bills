import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class Marker extends BaseMapComponent {
    constructor(props, context) {
        super(props, context, {
            events: ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover",
                "remove", "infowindowclose", "infowindowopen", "dragstart", "dragging",
                "dragend", "rightclick"],
            propKeys: ["offset", "icon", "enableMassClear", "enableDragging", "enableClicking",
                "raiseOnDrag", "draggingCursor", "rotation", "shadow", "title", "position"]
        });
    }

    componentDidMount() {
        this.setMapComponent(new BMap.Marker());
        this.changeByAllProps();
        this.bindEventListener();
        // this.onPropsChange("icon", this.props.icon);
        this.props.map.addOverlay(this.getMapComponent());
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
        if (JSON.stringify(this.props.icon) !== JSON.stringify(nextProps.icon)) {
            this.onPropsChange("icon", nextProps.icon);
        }
    }

    componentWillUnmount() {
        this.props.map.removeOverlay(this.getMapComponent());
    }

    onPropsChange(propName, value) {
        if (propName === "icon") {
            let {url, size: {width, height}} = value;
            let mapIcon = new global.BMap.Icon(url, new BMap.Size(width, height));
            this.getMapComponent().setIcon(mapIcon);
        }
    }
}
