import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from 'material-ui/Card';

import GraphSummary from './GraphSummary';
import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';
import { fromFields } from '../../sharedSelectors';
import { fromCharacteristic, fromDataset, fromFacet } from '../selectors';
import Format from '../Format';
import AppliedFacetList from '../facet/AppliedFacetList';
import { field as fieldPropTypes } from '../../propTypes';
import { toggleFacetValue } from '../facet';
import ExportableComponent from '../../lib/components/ExportableComponent';

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

const PureGraphPage = ({
    graphField,
    resource,
    filter,
    facets,
    toggleFacetValue,
}) => (
    <div style={styles.container}>
        <div style={styles.centerColumn}>
            <GraphSummary selected={graphField ? graphField.name : ''} />
            {graphField && (
                <Card style={styles.section}>
                    <ExportableComponent label={graphField.label}>
                        <Format
                            field={graphField}
                            resource={resource}
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

PureGraphPage.propTypes = {
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    facets: PropTypes.object.isRequired,
    toggleFacetValue: PropTypes.func,
};

const mapStateToProps = (state, { params: { name } }) => ({
    graphField: name && fromFields.getFieldByName(state, name),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    filter: fromDataset.getFilter(state),
    facets: fromFacet.getAppliedFacets(state),
});

const mapDispatchToProps = {
    toggleFacetValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(PureGraphPage);
