import PropTypes from "prop-types";
import BaseMapComponent from "./BaseMapComponent";
import BMap from "./BMap";

export default class Marker extends BaseMapComponent {
    static contextTypes = {
        map: PropTypes.any,
    };

    constructor(props, context) {
        super(props, context, {
            events: ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover",
                "remove", "infowindowclose", "infowindowopen", "dragstart", "dragging",
                "dragend", "rightclick"],
            propKeys: ["enableMassClear", "enableDragging", "enableClicking",
                "raiseOnDrag", "draggingCursor", "rotation", "title", "animation"],
            objectKeys: ["icon", "position", "offset", "shadow"]
        });
    }

    componentDidMount() {
        this.setMapComponent(new BMap.Marker());
        this.changeByAllProps();
        this.bindEventListener();
        this.context.map.addOverlay(this.getMapComponent());
    }

    componentWillReceiveProps(nextProps) {
        this.changeByDiffProps(nextProps);
    }

    componentWillUnmount() {
        this.context.map.removeOverlay(this.getMapComponent());
    }

    render() {
        return null;
    }
}
