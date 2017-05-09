import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../../propTypes';

const TitleView = ({ resource, field }) => {
    let level = 1;
    if (field.format && field.format.args && field.format.args.level) {
        level = field.format.args.level;
    }
    if (level === 1) {
        return (
            <h1>
                {resource[field.name]}
            </h1>
        );
    }
    if (level === 2) {
        return (
            <h2>
                {resource[field.name]}
            </h2>
        );
    }
    if (level === 3) {
        return (
            <h3>
                {resource[field.name]}
            </h3>
        );
    }
    return (
        <h4>
            {resource[field.name]}
        </h4>
    );
};

TitleView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

TitleView.defaultProps = {
    className: null,
};
export default TitleView;
