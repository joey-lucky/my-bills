import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class Marker extends BaseMapComponent {
    constructor(props, context) {
        super(props, context, {
            events: ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover",
                "remove", "infowindowclose", "infowindowopen", "dragstart", "dragging",
                "dragend", "rightclick"],
            propKeys: ["enableMassClear", "enableDragging", "enableClicking",
                "raiseOnDrag", "draggingCursor", "rotation", "title"],
            objectKeys: ["icon", "position", "setOffset", "shadow"]
        });
    }

    componentDidMount() {
        this.setMapComponent(new BMap.Marker());
        this.changeByAllProps();
        this.bindEventListener();
        this.props.map.addOverlay(this.getMapComponent());
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
    }

    componentWillUnmount() {
        this.props.map.removeOverlay(this.getMapComponent());
    }
}
