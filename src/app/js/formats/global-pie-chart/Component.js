import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import url from 'url';
import translate from 'redux-polyglot/translate';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { field as fieldPropTypes } from '../../propTypes';
import CustomizedLabel from './CustomizedLabel';


const moreThan = level => item => (item.value > level);

class ChartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        const { field, resource } = this.props;
        const { maxSize } = field.format.args || { maxSize: 10 };
        const uri = url.parse(resource[field.name]);
        uri.query = {
            uri: uri.path.slice(1),
            perPage: maxSize,
        };
        if (uri.pathname.indexOf('/api/') === 0) {
            uri.host = window.location.host;
            uri.protocol = window.location.protocol;
        }
        const apiurl = url.format(uri);
        fetch(apiurl)
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
        const { field } = this.props;
        const { colors } = field.format.args || { colors: '' };

        const colorsSet = String(colors).split(/[^\w]/).filter(x => x.length > 0).map(x => String('#').concat(x));
        return (
            <ResponsiveContainer width={400} height={300}>
                <PieChart>
                    <Legend
                        verticalAlign="middle"
                        layout="vertical"
                        align="left"
                    />
                    <Pie
                        cx="55%"
                        data={data}
                        fill="#8884d8"
                        outerRadius="63%"
                        labelLine
                        label={CustomizedLabel}
                    >
                        {
                            data.map((entry, index) => <Cell key={String(index).concat('_cell_pie')} fill={colorsSet[index % colorsSet.length]} />)
                        }
                    </Pie>
                </PieChart>
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

