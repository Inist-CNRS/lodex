import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import translate from 'redux-polyglot/translate';
import { ResponsiveContainer, ReferenceLine, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { field as fieldPropTypes } from '../../propTypes';

const moreThan = level => item => (item.value > level);

class ChartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        const { field } = this.props;
        const { maxSize } = field.format.args || { maxSize: 10 };
        const url = `/api/reduce/distinct?field=${encodeURIComponent(field.name)}&perPage=${maxSize}&sortBy=_id`;
        fetch(url)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const data = json.data.filter(moreThan(0)).map(item => ({ name: item._id, value: item.value }));
                    this.setState({ data });
                });
            });
    }

    render() {
        const { data } = this.state;
        const { field, resource } = this.props;
        const { chartWidth } = field.format.args || { chartWidth: '100%' };
        const charcoal = '#252525';
        const tomato = '#ff6347';
        const selected = data.findIndex(elm => (elm.name === resource[field.name]));
        return (
            <ResponsiveContainer width={chartWidth} aspect={chartWidth === '100%' ? 2 : 1}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 15, right: 50, left: 0, bottom: 0 }}
                    maxBarSize={10}
                >
                    <XAxis type="number" dataKey="value" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        interval={0}
                        padding={{ top: 3, bottom: 3 }}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ReferenceLine
                        y={resource[field.name]}
                        label={resource[field.name]}
                        stroke="tomato"
                        strokeDasharray="6 6"
                        isFront
                    />
                    <Bar
                        dataKey="value"
                        fill="#8884d8"
                    >
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${field.name}-${entry}`} fill={index === selected ? tomato : charcoal} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}


ChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

ChartView.defaultProps = {
    className: null,
};

export default translate(ChartView);

