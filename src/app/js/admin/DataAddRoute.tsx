// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import Upload from './upload/Upload';
import { fromParsing } from './selectors';
import { preLoadLoaders } from './loader';
import withInitialData from './withInitialData';

// @ts-expect-error TS7031
export const DataAddRouteComponent = ({ canUploadFile }) => {
    // @ts-expect-error TS2322
    return <Upload className="admin" isFirstFile={canUploadFile} />;
};

DataAddRouteComponent.propTypes = {
    canUploadFile: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
            // @ts-expect-error TS2571
            this.props.preLoadLoaders();
        },
    }),
    // @ts-expect-error TS2345
)(DataAddRouteComponent);
