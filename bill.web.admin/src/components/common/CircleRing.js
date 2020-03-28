import * as React from "react";
import {Row} from "antd";
import {Chart, Coord, Guide, Pie, Tooltip} from "viser-react";
import DomUtils from "@utils/DomUtils";
import * as PropTypes from "prop-types";

/**
 * 圆环图
 */
export default class CircleRing extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        data: PropTypes.arrayOf(PropTypes.shape({
            percent: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired
        })).isRequired,
        centerData: PropTypes.shape({
            percent: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired
        }),
        color: PropTypes.arrayOf(PropTypes.string),
        size: PropTypes.number
    };

    static createSinglePercentProps(percent = 0, label1 = "比例", label2 = "其他", color = ["#fcdb56", "#f0f2f5"]) {
        return {
            data: [
                {
                    percent: percent,
                    label: label1
                },
                {
                    percent: 1 - percent,
                    label: label2
                }
            ],
            color: color,
            centerData: {
                title: label1,
                percent: percent
            }
        };
    }

    render() {
        let {size = 350, color, data, centerData} = this.props;
        return (
            <Row style={{margin: "12px"}}>
                <Chart
                    padding={[12, 12, 12, 34]}
                    height={size}
                    width={size}
                    data={data}
                >
                    <Tooltip showTitle={false}/>
                    <Coord type="theta" radius={1} innerRadius={0.65}/>
                    <Pie
                        position="percent"
                        color={["label", color]}
                        tooltip={["label*percent", (label, percent) => ({
                            name: label,
                            value: Number(percent * 100).toFixed(2) + "%"
                        })]}
                    />
                    {
                        centerData &&
                        <Guide
                            type={"html"}
                            position={["50%", "50%"]}
                            html={DomUtils.toHtmlString(
                                <div>
                                    <div>{centerData.title}</div>
                                    <div style="font-weight:bold">{Number(centerData.percent * 100).toFixed(2) + "%"}</div>
                                </div>
                            )}
                        />
                    }
                    {
                        this.props.children
                    }
                </Chart>
            </Row>
        );
    }
}
