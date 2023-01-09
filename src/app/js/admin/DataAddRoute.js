import React from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import Upload from './upload/Upload';
import { fromParsing } from './selectors';
import { preLoadLoaders } from './loader';
import withInitialData from './withInitialData';

export const DataAddRouteComponent = ({ canUploadFile }) => {
    return <Upload className="admin" isFirstFile={canUploadFile} />;
};

DataAddRouteComponent.propTypes = {
    canUploadFile: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    canUploadFile: fromParsing.canUpload(state),
});

const mapDispatchToProps = {
    preLoadLoaders,
};

export const DataAddRoute = compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentWillMount() {
            this.props.preLoadLoaders();
        },
    }),
    translate,
)(DataAddRouteComponent);
