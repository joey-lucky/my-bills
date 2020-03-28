import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import * as PropTypes from "prop-types";
import * as styles from "./PreviewPhotoDialog.css";

export class AppState {
    @observable visible = false;
    @observable url = "";
}

@observer
export default class PreviewPhotoDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    onPhotoClick = () => {
        let {state} = this.props;
        state.visible = false;
    };

    render() {
        const {visible = false, url = ""} = this.props.state;
        if (visible) {
            return (
                <div
                    className={styles.container}
                    onClick={this.onPhotoClick}
                >
                    <img
                        className={styles.img}
                        alt={""}
                        src={url}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

export const previewPhotoState = new AppState();

