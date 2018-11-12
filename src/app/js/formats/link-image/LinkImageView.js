import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';

const LinkView = ({ className, resource, field, value }) => {
    const imageURL = value;
    const link = resource[field.name];
    const style = {};

    if (field.format.args.maxHeight) {
        style.maxHeight = field.format.args.maxHeight + 'px';
    }

    return (
        <Link className={className} href={`${link}`}>
            <img src={imageURL} style={style} />
        </Link>
    );
};

LinkView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    maxHeight: PropTypes.number.isRequired,
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
