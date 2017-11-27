import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { field as fieldPropTypes } from '../../propTypes.js';
import Format from '../Format';
import { fromCharacteristic } from '../selectors';
import GraphItemContainer from './GraphItemContainer';

const PureGraph = ({ field, resource }) => (
    <GraphItemContainer link={`/graph/${field.name}`} label={field.label}>
        <Format field={field} resource={resource} />
    </GraphItemContainer>
);

PureGraph.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
});

export default connect(mapStateToProps)(PureGraph);
