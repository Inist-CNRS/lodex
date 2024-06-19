import { field as fieldPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import ejs from 'ejs/ejs.min.js'; // import the browser-friendly build from ejs
import injectData from '../../injectData';
import InvalidFormat from '../../InvalidFormat';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import _ from 'lodash';

const EJSView = ({ field, data, template }) => {
    const [onError, setOnError] = useState(false);
    const [error, setError] = useState(false);

    const compiledTemplate = useMemo(() => {
        try {
            const t = ejs.compile(template);
            setOnError(false);
            return t;
        } catch (err) {
            setOnError(true);
            setError(err);
            return null;
        }
    }, [template]);

    const html = useMemo(() => {
        if (!compiledTemplate) {
            return '';
        }
        try {
            const h = compiledTemplate({ root: data, _ });
            setOnError(false);
            return h;
        } catch (err) {
            setOnError(true);
            setError(err);
            return 'null';
        }
    }, [compiledTemplate, data]);

    if (onError) {
        return <InvalidFormat format={field.format} value={error.message} />;
    }

    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

EJSView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.shape({
        total: PropTypes.number,
        values: PropTypes.any,
    }),
    template: PropTypes.string.isRequired,
};

EJSView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData, formatTotal }) => {
    if (!formatData) {
        return {
            data: {
                total: 0,
                values: undefined,
            },
        };
    }
    if (!Array.isArray(formatData)) {
        return {
            data: {
                total: 1,
                values: formatData,
            },
        };
    }
    return {
        data: {
            total: formatTotal,
            values: formatData,
        },
    };
};

export const EJSAdminView = connect((state, { dataset }) => {
    return {
        field: {
            name: 'Preview',
            format: 'Preview Format',
        },
        data: {
            total: dataset.values,
            values: dataset.values,
        },
    };
})(EJSView);

export default compose(injectData(), connect(mapStateToProps))(EJSView);
