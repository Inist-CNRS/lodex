import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { field as fieldPropTypes } from '../../propTypes';

const RedirectView = ({ className, field, resource }) => {
    const url = resource[field.name];

    useEffect(() => {
        window.location.href = url;
    });

    return (
        <div className={className}>
            <Helmet>
                <link rel="canonical" href={url} />
            </Helmet>
            <a href={url}>{url}</a>
        </div>
    );
};

RedirectView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

RedirectView.defaultProps = {
    className: '',
};

export default RedirectView;
