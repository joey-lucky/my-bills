import * as React from "react";
import * as PropTypes from "prop-types";
import {UUID} from "@utils/UUID";
import {observer} from "mobx-react";
import PropsUtils from "@utils/PropsUtils";

@observer
export default class YS7CameraVideo extends React.Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
        style: PropTypes.object,
        className: PropTypes.string,
        autoPlay: PropTypes.bool,
        controls: PropTypes.bool,
        controlsList: PropTypes.string,
        crossOrigin: PropTypes.string,
        loop: PropTypes.bool,
        mediaGroup: PropTypes.string,
        muted: PropTypes.bool,
        playsinline: PropTypes.bool,
        preload: PropTypes.string
    };

    _id = UUID.randomUUID(8);
    _player;

    componentDidMount() {
        this.initVideo(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !PropsUtils.isEqual(nextProps, this.props, "src");
    }

    componentDidUpdate(prevProps, prevState) {
        this.releaseVideo();
        this.initVideo(this.props);
    }

    componentWillUnmount() {
        this.releaseVideo();
    }

    releaseVideo() {
        if (this._player) {
            this._player.stop();
        }
        let ele = global.document.getElementById(this._id);
        if (ele) {
            ele.removeAttribute("src");
        }
    }

    initVideo(props) {
        let {src} = props;
        if (src && src !== "" && global.EZUIPlayer) {
            this._player = new global.EZUIPlayer(this._id);
            this._player.on("log", (str) => {
                console.log(str);
            });
        }
    }

    render() {
        let {src = "", poster = "", id, ...props} = this.props;
        return (
            <video
                {...props}
                id={this._id}
                poster={poster}
            >
                <source
                    src={src}
                    type="application/x-mpegURL"
                />
            </video>
        );
    }
}
