import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import Upload from './upload/Upload';
import { fromParsing } from './selectors';
import { preLoadLoaders } from './loader';
import withInitialData from './withInitialData';

// @ts-expect-error TS7031
export const DataAddRouteComponent = ({ canUploadFile }) => {
    return <Upload className="admin" isFirstFile={canUploadFile} />;
};

DataAddRouteComponent.propTypes = {
    canUploadFile: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
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
)(DataAddRouteComponent);
