import * as React from "react";
import * as styles from "./index.css";
import BottomIcon from "@pages/Home/BottomBar/BottomIcon";
import * as PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

@withRouter
export default class BottomBar extends React.Component {
    static propTypes = {
        onItemClick: PropTypes.func,
        data: PropTypes.array.isRequired,
    };

    render() {
        return (
            <div className={styles.container}>
                {
                    this.props.data.map((item, index, array) =>
                        <React.Fragment key={item.label}>
                            <BottomIcon
                                title={item.label}
                                unicode={item.icon}
                                onClick={() => {
                                    let pathname = this.props.location.pathname;
                                    let parentPath = pathname.replace(/[^/]+$/, "");
                                    this.props.history.push(parentPath + item.url);
                                }}
                            />
                            {index === 1 && <div className={styles.center}>记一笔</div>}
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}