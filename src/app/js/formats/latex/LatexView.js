import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import katex from 'katex';
import Helmet from 'react-helmet';
import { field as fieldPropTypes } from '../../propTypes';
import InvalidFormat from '../InvalidFormat';

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        container: {
            padding: 0,
            margin: 0,
        },
    },
    'latex',
);

const LatexView = ({ resource, field }) => {
    const value = resource[field.name];

    let html;
    try {
        html = katex.renderToString(resource[field.name], {
            displayMode: false,
            leqno: true,
            fleqn: true,
            throwOnError: false,
            errorColor: '#cc0000',
            strict: 'warn',
            output: 'html',
            trust: false,
        });
    } catch (e) {
        return <InvalidFormat format={field.format} value={value} />;
    }

    return (
        <div className={classnames('latex-container', styles.container)}>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/katex@0.13.3/dist/katex.min.css"
                    integrity="sha384-ThssJ7YtjywV52Gj4JE/1SQEDoMEckXyhkFVwaf4nDSm5OBlXeedVYjuuUd0Yua+"
                    crossOrigin="anonymous"
                />
            </Helmet>
            <div
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </div>
    );
};

LatexView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

LatexView.defaultProps = {
    className: null,
};

export default LatexView;
