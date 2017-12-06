import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from 'material-ui/Card';

import GraphSummary from './GraphSummary';
import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';
import { fromFields } from '../../sharedSelectors';
import {
    fromCharacteristic,
    fromDataset,
    fromFacet,
    fromGraph,
} from '../selectors';
import Format from '../Format';
import AppliedFacetList from '../facet/AppliedFacetList';
import { field as fieldPropTypes } from '../../propTypes';
import { toggleFacetValue } from '../facet';
import ExportableComponent from '../../lib/components/ExportableComponent';
import { preLoadChartData } from '../graph';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    sideColumn: {
        padding: '10px',
        width: '25%',
        flexGrow: 1,
        margin: '20px 0',
    },
    centerColumn: {
        padding: '10px',
        width: '75%',
        flexGrow: 4,
    },
    section: {
        margin: '20px 0',
    },
};

class PureGraphPage extends Component {
    componentDidMount() {
        const { graphField: field, resource, preLoadChartData } = this.props;
        if (!field) {
            return;
        }

        preLoadChartData({ field, value: resource[field.name] });
    }

    componentDidUpdate() {
        const { graphField: field, resource, preLoadChartData } = this.props;
        if (!field) {
            return;
        }

        preLoadChartData({ field, value: resource[field.name] });
    }

    render() {
        const {
            graphField,
            resource,
            filter,
            facets,
            chartData,
            toggleFacetValue,
        } = this.props;

        return (
            <div style={styles.container}>
                <div style={styles.centerColumn}>
                    <GraphSummary
                        selected={graphField ? graphField.name : ''}
                    />
                    {graphField &&
                        chartData && (
                            <Card style={styles.section}>
                                <ExportableComponent label={graphField.label}>
                                    <Format
                                        field={graphField}
                                        resource={resource}
                                        chartData={chartData}
                                        filter={filter}
                                        facets={facets}
                                        toggleFacetValue={toggleFacetValue}
                                    />
                                </ExportableComponent>
                            </Card>
                        )}
                    <Card style={styles.section}>
                        <AppliedFacetList />
                    </Card>
                    <Card style={styles.section}>
                        <Dataset />
                    </Card>
                </div>
                <div style={styles.sideColumn}>
                    <Toolbar />
                </div>
            </div>
        );
    }
}

PureGraphPage.propTypes = {
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    facets: PropTypes.object.isRequired,
    toggleFacetValue: PropTypes.func,
    chartData: PropTypes.any,
    preLoadChartData: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { params: { name } }) => ({
    graphField: name && fromFields.getFieldByName(state, name),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    filter: fromDataset.getFilter(state),
    facets: fromFacet.getAppliedFacets(state),
    chartData: fromGraph.getChartData(state, name),
});

const mapDispatchToProps = {
    toggleFacetValue,
    preLoadChartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PureGraphPage);
