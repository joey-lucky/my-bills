import * as React from "react";
import * as PropTypes from "prop-types";
import * as style from "./Tabs.css";

const TopTab = (props) => {
    const getItemStyle = (item, index) => item === props.activeKey ? style.selectItem : style.item;
    const {data, onItemClick} = props;
    return (
        <div className={style.topContainer}>
            {data.map((item, index) =>
                <div
                    key={item}
                    className={getItemStyle(item, index)}
                    onClick={() => {
                        onItemClick && onItemClick(item, index);
                    }}
                >{item}</div>
            )}
        </div>
    );
};
TopTab.propTypes = {
    data: PropTypes.any,
    onItemClick: PropTypes.any
};

const TabPane = (props) => {
    const {active, forceRender} = props;
    if (active) {
        return (
            <div className={style.content}>
                {props.children}
            </div>
        );
    } else {
        if (forceRender) {
            return (
                <div className={style.contentHide}>
                    {props.children}
                </div>
            );
        } else {
            return null;
        }
    }
};

TabPane.propTypes = {
    active: PropTypes.any,
    forceRender: PropTypes.any,
    children: PropTypes.any
};

export default class Tabs extends React.Component {
    static TabPane = TabPane;

    static propTypes = {
        children: PropTypes.any,
        style: PropTypes.any,
        defaultActiveKey: PropTypes.any,
        onChange: PropTypes.any
    };

    constructor(props, context) {
        super(props, context);
        let {children} = this.props;
        let data = children.map((childItem, index) =>
            childItem.props.tab
        );
        let activeKey = this.props.defaultActiveKey || data[0];
        this.state = {data, activeKey};
    }

    onItemClick = (item, index) => {
        const {onChange} = this.props;
        this.setState({activeKey: item});
        onChange && onChange(item, index);
    };

    render() {
        const {activeKey, data} = this.state;
        const {children} = this.props;
        const position = data.indexOf(activeKey);
        return (
            <div
                className={style.container}
                style={this.props.style}
            >
                <TopTab
                    data={data}
                    activeKey={activeKey}
                    onItemClick={this.onItemClick}
                />
                {React.Children.map(children, (child, index) =>
                    <child.type {...child.props} active={index === position} key={index}/>
                )}
            </div>
        );
    }
}
