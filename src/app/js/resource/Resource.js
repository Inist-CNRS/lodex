import React, { PropTypes } from 'react';

const Resource = ({ uri }) => (
    <h1>{uri}</h1>
);

Resource.defaultProps = {
    uri: null,
};

Resource.propTypes = {
    uri: PropTypes.string,
};

export default Resource;
