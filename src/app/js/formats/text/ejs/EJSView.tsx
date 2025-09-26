import { field as fieldPropTypes } from '../../../propTypes';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
// @ts-expect-error TS7016
import ejs from 'ejs/ejs.min.js'; // import the browser-friendly build from ejs
import injectData from '../../injectData';
import DOMPurify from 'dompurify';
import InvalidFormat from '../../InvalidFormat';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import _ from 'lodash';

// @ts-expect-error TS7031
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
            // @ts-expect-error TS2345
            setError(err);
            return null;
        }
    }, [template]);

    const html = useMemo(() => {
        if (!compiledTemplate) {
            return '';
        }
        try {
            const buildedHTML = compiledTemplate({ root: data, _ });
            setOnError(false);
            const sanitizedHTML = DOMPurify.sanitize(buildedHTML);
            return sanitizedHTML;
        } catch (err) {
            setOnError(true);
            // @ts-expect-error TS2345
            setError(err);
            return 'null';
        }
    }, [compiledTemplate, data]);

    if (onError) {
        // @ts-expect-error TS2339
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

// @ts-expect-error TS7006
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

// @ts-expect-error TS2339
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
    // @ts-expect-error TS2345
})(EJSView);

export default compose(injectData(), connect(mapStateToProps))(EJSView);
