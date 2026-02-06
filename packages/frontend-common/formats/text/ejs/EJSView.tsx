import { useMemo, useState } from 'react';
// @ts-expect-error TS7016
import ejs from 'ejs/ejs.min.js'; // import the browser-friendly build from ejs
import injectData from '../../injectData';
import DOMPurify from 'dompurify';
import InvalidFormat from '../../InvalidFormat';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import _ from 'lodash';
import type { Field } from '../../../fields/types';

interface EJSViewProps {
    field: Field;
    resource: object;
    data?: {
        total?: number;
        values?: any;
    };
    template: string;
}

const EJSView = ({ field, data, template }: EJSViewProps) => {
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

export default compose(
    injectData(null, null, true),
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(EJSView);
