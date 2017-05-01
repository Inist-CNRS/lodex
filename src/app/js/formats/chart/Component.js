import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import { VictoryBar } from 'victory';
import { field as fieldPropTypes } from '../../propTypes';

export default class ChartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [],
            labels: [],
        };
    }

    componentDidMount() {
        const { field } = this.props;
        const url = `/api/facet/${field.name}/`;
        fetch(url)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const series = json.data.map(item => item.count);
                    const labels = json.data.map(item => item.value);
                    this.setState({ series, labels });
                });
            })
            .catch(console.error);
    }

    render() {
        const { series, labels } = this.state;
        return (
            <VictoryBar
                data={series}
                labels={labels}
            />
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
