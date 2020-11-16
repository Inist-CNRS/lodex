import React from 'react';
import { Card } from '@material-ui/core';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import ParsingResult from './parsing/ParsingResult';
import Statistics from './Statistics';
import { fromPublication } from './selectors';
import Published from './publish/Published';
import withInitialData from './withInitialData';

export const DataRouteComponent = ({ hasPublishedDataset }) => {
    if (hasPublishedDataset) {
        return (
            <div className="admin">
                <Card style={{ marginTop: '0.5rem' }}>
                    <Published />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ marginLeft: '-20px' }}>
            <ParsingResult />
            <Statistics mode="data" />
        </div>
    );
};

DataRouteComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

export const DataRoute = compose(
    withInitialData,
    connect(mapStateToProps),
    translate,
)(DataRouteComponent);
