import { field as fieldPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import ejs from 'ejs/ejs.min.js';
import injectData from '../../injectData';
import InvalidFormat from '../../InvalidFormat';

const EJSView = ({ resource, field, formatData, template }) => {
    const [error, setError] = useState(false);

    const compiledTemplate = useMemo(() => {
        try {
            return ejs.compile(template);
        } catch (_) {
            setError(true);
            return null;
        }
    }, [template]);

    const html = useMemo(() => {
        if (!compiledTemplate) {
            return '';
        }
        try {
            return compiledTemplate({ formatData });
        } catch (_) {
            setError(true);
            return 'null';
        }
    }, [compiledTemplate, formatData]);

    if (error) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

EJSView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    formatData: PropTypes.any,
    template: PropTypes.string.isRequired,
};

EJSView.defaultProps = {
    className: null,
};

export default injectData()(EJSView);
