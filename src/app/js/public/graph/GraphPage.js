import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GraphSummary from './GraphSummary';
import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';
import { fromFields } from '../../sharedSelectors';
import { fromCharacteristic } from '../selectors';
import Format from '../Format';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    sideColumn: {
        padding: 5,
        width: '20%',
        flexGrow: 1,
    },
    centerColumn: {
        padding: 5,
        width: '60%',
        flexGrow: 3,
    },
};

const PureGraph = ({ graphField, resource }) => (
    <div style={styles.container}>
        <div style={styles.sideColumn}>
            <GraphSummary />
        </div>
        <div style={styles.centerColumn}>
            {graphField && <Format field={graphField} resource={resource} />}
            <Dataset />
        </div>
        <div style={styles.sideColumn}>
            <Toolbar />
        </div>
    </div>
);

PureGraph.propTypes = {
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { params: { name } }) => ({
    graphField: name && fromFields.getFieldByName(state, name),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
});

export default connect(mapStateToProps)(PureGraph);
