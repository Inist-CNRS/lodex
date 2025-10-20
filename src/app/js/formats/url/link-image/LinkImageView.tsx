// @ts-expect-error TS6133
import React from 'react';

import { field as fieldPropTypes } from '../../../propTypes';
import Link from '../../../lib/components/Link';

interface LinkViewProps {
    className?: string;
    field: unknown;
    fields: unknown[];
    linkedResource?: object;
    resource: object;
    type: string;
    value: string;
    maxHeight: number;
}

const LinkView = ({
    className,
    resource,
    field,
    value
}: LinkViewProps) => {
    const imageURL = value;
    const link = resource[field.name];
    const style = {};

    if (field.format.args.maxHeight) {
        // @ts-expect-error TS2339
        style.maxHeight = field.format.args.maxHeight + 'px';
    }

    return (
        (<Link className={className} href={`${link}`}>
            <img src={imageURL} style={style} />
        </Link>)
    );
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
