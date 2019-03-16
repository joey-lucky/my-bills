import * as React from "react";
import UUID from "@utils/UUID";
import * as PropTypes from "prop-types";
import G2 from "@antv/g2";

export default class TotalPieChart extends React.Component {
    static propTypes = {
        value: PropTypes.arrayOf(PropTypes.shape({
            bill_type_name: PropTypes.string.isRequired,
            percent: PropTypes.number.isRequired,
            money: PropTypes.number.isRequired,
        }))
    };

    _containerId = UUID.randomUUID(16);
    _chart;

    componentDidMount() {
        let chart = new G2.Chart({
            container: this._containerId,
            forceFit: true,
            height: 300,
            padding: [12, 0, 40, 0]
        });
        chart.source(this.props.value, {
            percent: {
                formatter: function formatter(val) {
                    val = Number(val * 100).toFixed(2) + '%';
                    return val;
                }
            }
        });
        chart.coord('theta');
        chart.tooltip({
            showTitle: false
        });
        chart.intervalStack()
            .position('percent')
            .color('bill_type_name')
            .label('percent', {
                offset: -40,
                // autoRotate: false,
                textStyle: {
                    textAlign: 'center',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)'
                }
            })
            .tooltip('bill_type_name*money', function (bill_type_name, money) {
                return {
                    name: bill_type_name,
                    value: money
                };
            })
            .style({
                lineWidth: 1,
                stroke: '#fff'
            });
        chart.render();
        this._chart = chart;
    }

    componentWillUnmount() {
        this._chart && this._chart.destroy();
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value)) {
            this._chart.changeData(this.props.value);
        }
    }

    render() {
        return (
            <div
                style={{width: "100%", height: 300}}
                id={this._containerId}/>
        );
    }
}