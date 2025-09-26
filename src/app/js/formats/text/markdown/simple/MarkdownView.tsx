import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import MarkdownIt from 'markdown-it';

import { field as fieldPropTypes } from '../../../../propTypes';
import InvalidFormat from '../../../InvalidFormat';

const markdown = new MarkdownIt();

// @ts-expect-error TS7031
const MarkdownView = ({ className, resource, field }) => {
    const [value, content] = useMemo(() => {
        const value = resource[field.name];

        try {
            return [value, markdown.render(value)];
        } catch (e) {
            return [value, null];
        }
    }, [resource, field.name]);

    if (content == null) {
        return <InvalidFormat format={field.format} value={value} />;
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
};

MarkdownView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

MarkdownView.defaultProps = {
    className: null,
};

export default MarkdownView;
