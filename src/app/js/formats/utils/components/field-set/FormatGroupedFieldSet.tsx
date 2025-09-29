// @ts-expect-error TS6133
import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';

type FormatGroupedFieldSetProps = {
    children: ReactNode;
};

const FormatGroupedFieldSet = ({ children }: FormatGroupedFieldSetProps) => {
    return <div>{children}</div>;
};

FormatGroupedFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormatGroupedFieldSet;
