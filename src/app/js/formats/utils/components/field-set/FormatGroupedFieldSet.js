import React from 'react';
import PropTypes from 'prop-types';

/**
 * This element is used to group multiple FormatFieldSets in a flex box.
 * @param children {React.ReactNode}
 * @returns {JSX.Element}
 */
const FormatGroupedFieldSet = ({ children }) => {
    return <div>{children}</div>;
};

FormatGroupedFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormatGroupedFieldSet;
