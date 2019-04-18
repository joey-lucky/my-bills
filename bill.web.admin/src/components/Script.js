import * as React from "react";
import * as PropTypes from "prop-types";
import PropsUtils from "@utils/PropsUtils";
import {UUID} from "@utils/UUID";


export default class Script extends React.Component {
    static _prefix = UUID.randomUUID(16);

    static propTypes = {
        src: PropTypes.string.isRequired,
        removeScriptWhenLoad: PropTypes.bool,
        renderWhenLoad: PropTypes.bool,
        onLoad: PropTypes.func
    };

    static SUCCESS = 1;
    static ERROR = -1;
    static UN_LOAD = 0;


    constructor(props, context) {
        super(props, context);
        this.state = {
            status: Script.UN_LOAD
        };
    }

    componentDidMount() {
        this.downloadScript(this.props).then((status) => {
            this.setState({status: status});
            if (status === Script.SUCCESS) {
                this.props.onLoad && this.props.onLoad();
            }
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!PropsUtils.isEqual(nextProps, this.props, "src")) {
            this.downloadScript(nextProps).then((status) => {
                this.setState({status: status});
                if (status === Script.SUCCESS) {
                    this.props.onLoad && this.props.onLoad();
                }
            });
        }
    }

    downloadScript = (props) => {
        let {src, removeScriptWhenLoad} = props;
        let statusId = Script._prefix + "_status" + src;
        return new Promise((resolve) => {
            if (src) {
                const onLoad = (ele) => {
                    if (removeScriptWhenLoad) {
                        global.document.body.removeChild(ele);
                    }
                    global[statusId] = Script.SUCCESS;
                    resolve(Script.SUCCESS);
                };
                if (global[statusId] === Script.SUCCESS) {
                    resolve(Script.SUCCESS);
                } else {
                    const script = document.createElement("script");
                    script.src = src;
                    script.onload = () => {
                        onLoad(script);
                    };
                    global.document.body.appendChild(script);
                }
            } else {
                resolve(Script.ERROR);
            }
        });
    };

    render() {
        const {renderWhenLoad} = this.props;
        if (renderWhenLoad) {
            if (this.state.status === 1) {
                return this.props.children;
            } else {
                return null;
            }
        } else {
            return this.props.children || null;
        }
    }


}
