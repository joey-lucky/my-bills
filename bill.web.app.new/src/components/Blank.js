import * as React from "react";
import * as PropTypes from "prop-types";
import {Flex} from "antd-mobile";
import {ReactNode} from "react";

/**
 * 顶部状态栏高度：24dp
 * Appbar最小高度：56dp
 * 底部导航栏高度：48dp
 * 悬浮按钮尺寸：56x56dp/40x40dp
 * 用户头像尺寸：64x64dp/40x40dp
 * 小图标点击区域：48x48dp
 * 侧边抽屉到屏幕右边的距离：56dp
 * 卡片间距：8dp
 * 分隔线上下留白：8dp
 * 大多元素的留白距离：16dp
 * 屏幕左右对齐基线：16dp
 * 文字左侧对齐基线：72dp
 */
export default class Blank extends React.Component {
    static propTypes = {
        direction: PropTypes.oneOf(["row", "column"]),
        level: PropTypes.oneOf([1, 2]).isRequired,
        style:PropTypes.object,
    };

    render() {
        let propStyle = this.props.style || {};
        let size = 0.1 * this.props.level + "rem";
        let style;
        if (this.props.direction === "row") {
            style = {
                height: "100%",
                paddingLeft:size,
                paddingRight:size,
            }
        } else {
            style = {
                width: "100%",
                paddingTop:size,
                paddingBottom:size,
            }
        }
        style = {...style, ...propStyle};
        return (
            <Flex
                style={style}
                justify={"center"}
                align={"center"}
                {...this.props}
            >
                {
                    this.props.children
                }
            </Flex>
        )
    }
}