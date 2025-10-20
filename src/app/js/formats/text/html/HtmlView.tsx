// @ts-expect-error TS6133
import React from 'react';
import DOMPurify from 'dompurify';
import { field as fieldPropTypes } from '../../../propTypes';

interface HtmlViewProps {
    className?: string;
    field: unknown;
    resource: object;
}

const HtmlView = ({
    className,
    resource,
    field
}: HtmlViewProps) => {
    const sanitizedHTML = DOMPurify.sanitize(resource[field.name]);
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    );
};

HtmlView.defaultProps = {
    className: null,
};

export default HtmlView;
