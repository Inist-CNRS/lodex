import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import url from 'url';
import querystring from 'querystring';
import translate from 'redux-polyglot/translate';
import { ResponsiveContainer, RadarChart, Radar, PolarAngleAxis, PolarRadiusAxis, PolarGrid } from 'recharts';
import { field as fieldPropTypes } from '../../propTypes';


const valueMoreThan = level => item => (item.value > level);

class RadarChartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        const { field, resource } = this.props;
        const uri = url.parse(resource[field.name]);
        const query = querystring.parse(uri.query || '');
        const uriNew = {
            ...uri,
            query: {
                ...query,
            },
            search: '',
        };
        if (uri.pathname.indexOf('/api/') === 0) {
            uriNew.host = window.location.host;
            uriNew.protocol = window.location.protocol;
        }
        const apiurl = url.format(uriNew);
        fetch(apiurl)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    if (json.data) {
                        const data = json.data
                            .filter(valueMoreThan(0))
                            .map(item => ({ name: item._id, value: item.value }));
                        this.setState({ data });
                    }
                    if (json.aggregations) {
                        const firstKey = Object.keys(json.aggregations).shift();
                        const data = json.aggregations[firstKey].buckets
                            .map(item => ({ name: item.keyAsString || item.key, value: item.docCount }));
                        this.setState({ data });
                    }
                });
            });
    }

    render() {
        const { data } = this.state;
        const { field } = this.props;
        const { colors } = field.format.args || { colors: '' };
        const colorsSet = String(colors).split(/[^\w]/).filter(x => x.length > 0).map(x => String('#').concat(x));
        const color = colorsSet[0];
        return (
            <ResponsiveContainer width={600} height={300}>
                <RadarChart
                    data={data}
                >
                    <Radar
                        dataKey="value"
                        stroke={color}
                        fill={color}
                        fillOpacity={0.6}
                    />
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                </RadarChart>
            </ResponsiveContainer>
        );
    }
}

RadarChartView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

RadarChartView.defaultProps = {
    className: null,
};

export default translate(RadarChartView);

