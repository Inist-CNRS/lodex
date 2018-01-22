import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'material-ui/Card';

import GraphSummary from './GraphSummary';
import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';
import { fromFields } from '../../sharedSelectors';
import { fromCharacteristic } from '../selectors';
import Format from '../Format';
import AppliedFacetList from '../facet/AppliedFacetList';
import { field as fieldPropTypes } from '../../propTypes';
import { preLoadChartData } from '../graph';
import EditButton from '../../fields/editFieldValue/EditButton';
import EditOntologyFieldButton from '../../fields/ontology/EditOntologyFieldButton';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';
import CompositeProperty from '../Property/CompositeProperty';
import { grey500 } from 'material-ui/styles/colors';

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
    label: {
        display: 'flex',
        alignItems: 'center',
        color: grey500,
        fontWeight: 'bold',
        fontSize: '2rem',
    },
};

const GraphPage = ({ graphField, resource }) => (
    <div style={styles.container}>
        <div style={styles.centerColumn}>
            <GraphSummary selected={graphField ? graphField.name : ''} />
            {graphField && (
                <Card style={styles.section}>
                    <CardTitle style={styles.label}>
                        {graphField.label}
                        <EditButton field={graphField} resource={resource} />
                        <EditOntologyFieldButton
                            field={graphField}
                            resource={resource}
                        />
                    </CardTitle>
                    <Format field={graphField} resource={resource} />
                    <CompositeProperty
                        key="composite"
                        field={graphField}
                        resource={resource}
                        parents={[]}
                    />
                    <PropertyLinkedFields
                        fieldName={graphField.name}
                        resource={resource}
                        parents={[]}
                    />
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

GraphPage.propTypes = {
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
    preLoadChartData: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { params: { name } }) => ({
    graphField: name && fromFields.getFieldByName(state, name),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
});

const mapDispatchToProps = {
    preLoadChartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphPage);
