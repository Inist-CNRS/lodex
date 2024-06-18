import { field as fieldPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import ejs from 'ejs';

const EJSView = ({ resource, field }) => {
    const template = field.format.args.template;
    const values = resource[field.name];

    const compiledTemplate = useMemo(() => {
        return ejs.compile(template);
    }, [template]);

    const html = useMemo(() => {
        return compiledTemplate(values);
    }, [compiledTemplate, values]);

    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

EJSView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

EJSView.defaultProps = {
    className: null,
};

export default EJSView;
