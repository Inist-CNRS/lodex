import React from 'react';
import { Card } from '@material-ui/core';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import ParsingResult from './parsing/ParsingResult';
import Statistics from './Statistics';
import { fromParsing, fromPublication } from './selectors';
import Published from './publish/Published';
import Upload from './upload/Upload';
import { preLoadLoaders } from './loader';
import withInitialData from './withInitialData';

export const DataRouteComponent = ({ canUploadFile, hasPublishedDataset }) => {
    if (hasPublishedDataset) {
        return (
            <div className="admin">
                <Card style={{ marginTop: '0.5rem' }}>
                    <Published />
                </Card>
            </div>
        );
    }

    if (canUploadFile) {
        return (
            <div style={{ margin: '0 100px' }}>
                <Upload className="admin" isFirstFile={canUploadFile} />
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
    canUploadFile: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    canUploadFile: fromParsing.canUpload(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export const DataRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            this.props.preLoadLoaders();
        },
    }),
    translate,
)(DataRouteComponent);
