import React from 'react';
import { Card } from '@material-ui/core';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import ParsingResult from './parsing/ParsingResult';
import Statistics from './Statistics';
import Upload from './upload/Upload';
import { fromParsing, fromPublication } from './selectors';
import Published from './publish/Published';
import withInitialData from './withInitialData';
import { preLoadLoaders } from './loader/';

export const DataComponent = ({ hasPublishedDataset, canUploadFile }) => {
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
                <Upload className="admin" />
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

DataComponent.propTypes = {
    loadingParsingResult: PropTypes.bool.isRequired,
    hasPublishedDataset: PropTypes.bool.isRequired,
    canUploadFile: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    canUploadFile: fromParsing.canUpload(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export const Data = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            this.props.preLoadLoaders();
        },
    }),
    translate,
)(DataComponent);
