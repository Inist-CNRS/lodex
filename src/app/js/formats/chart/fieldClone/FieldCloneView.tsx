import type { Field } from '../../../fields/types';
import InvalidFormat from '../../InvalidFormat';
import { getViewComponent } from '../../index';
import getColorSetFromField from '@lodex/frontend-common/utils/getColorSetFromField';

interface FieldCloneViewProps {
    className?: string;
    field: Field;
    fields: Field[];
    resource: object;
    value: string;
}

const FieldCloneView = ({
    className,
    resource,
    field,
    fields,
    value,
}: FieldCloneViewProps) => {
    const clonedField = fields.find((item) => item.name === value);

    const colorSet = getColorSetFromField(clonedField);
    const otherProps = { colorSet: colorSet ? colorSet : undefined };

    if (
        !clonedField ||
        typeof clonedField !== 'object' ||
        // @ts-expect-error TS2339
        (clonedField.format && clonedField.format.name === 'fieldClone')
    ) {
        // @ts-expect-error TS18046
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

export default FieldCloneView;
