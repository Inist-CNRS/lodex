import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7031
const IFrameView = ({ resource, field, viewWidth, aspectRatio }) => {

    const srcURL = resource[field.name];
    const style = {
        overflow: 'hidden',
        width: viewWidth,
        aspectRatio,
    };

    return <iframe
        style={style}
        src={srcURL}
        referrerPolicy="origin"
        sandbox="allow-scripts allow-same-origin"
    />;
};

IFrameView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    viewWidth: PropTypes.string.isRequired,
    aspectRatio: PropTypes.string.isRequired,
};

IFrameView.defaultProps = {
    className: null,
};

export default IFrameView;
