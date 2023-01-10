import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import ParsingResult from './parsing/ParsingResult';
import { fromParsing, fromPublication } from './selectors';
import Upload from './upload/Upload';
import { preLoadLoaders } from './loader';
import withInitialData from './withInitialData';

export const DataRouteComponent = ({ canUploadFile }) => {
    if (canUploadFile) {
        return <Upload className="admin" isFirstFile={canUploadFile} />;
    }

    return (
        <div style={{ marginLeft: '-20px' }}>
            <ParsingResult dataGrid />
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
