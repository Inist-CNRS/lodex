// @ts-expect-error TS6133
import React from 'react';

import { field as fieldPropTypes } from '../../../propTypes';
import getLabel from '../../utils/getLabel';
import Link from '../../../lib/components/Link';

interface EmailViewProps {
    className?: string;
    field: unknown;
    fields: unknown[];
    resource: object;
    type: string;
    value: string;
}

const EmailView = ({
    className,
    resource,
    field,
    fields,
    type,
    value
}: EmailViewProps) => {
    const label = getLabel(field, resource, fields, type, value);
    const email = resource[field.name];

    return (
        (<Link className={className} to={`mailto:${email}`}>
            {label}
        </Link>)
    );
};

EmailView.defaultProps = {
    className: null,
};

export default EmailView;
