import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../propTypes';
import Link from '../../../lib/components/Link';

// @ts-expect-error TS7031
const LinkView = ({ className, resource, field, value }) => {
    const imageURL = value;
    const link = resource[field.name];
    const style = {};

    if (field.format.args.maxHeight) {
        // @ts-expect-error TS2339
        style.maxHeight = field.format.args.maxHeight + 'px';
    }

    return (
        // @ts-expect-error TS2739
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
