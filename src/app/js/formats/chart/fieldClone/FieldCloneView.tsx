// @ts-expect-error TS6133
import React from 'react';

import { field as fieldPropTypes } from '../../../propTypes';
import InvalidFormat from '../../InvalidFormat';
import { getViewComponent } from '../../index';
import getColorSetFromField from '../../../lib/getColorSetFromField';

interface FieldCloneViewProps {
    className?: string;
    field: unknown;
    fields: unknown[];
    resource: object;
    value: string;
}

const FieldCloneView = ({
    className,
    resource,
    field,
    fields,
    value
}: FieldCloneViewProps) => {
    // @ts-expect-error TS7006
    const clonedField = fields.find((item) => item.name === value);

    const colorSet = getColorSetFromField(clonedField);
    const otherProps = { colorSet: colorSet ? colorSet : undefined };

    if (
        !clonedField ||
        typeof clonedField !== 'object' ||
        (clonedField.format && clonedField.format.name === 'fieldClone')
    ) {
        return <InvalidFormat format={field.format} value={value} />;
    }

    const { ViewComponent, args } = getViewComponent(clonedField, false);

    return (
        <ViewComponent
            className={className}
            field={clonedField}
            fields={fields}
            resource={resource}
            {...args}
            {...otherProps}
        />
    );
};

FieldCloneView.defaultProps = {
    className: null,
};

export default FieldCloneView;
