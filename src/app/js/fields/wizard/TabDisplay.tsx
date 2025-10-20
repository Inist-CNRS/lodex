import { field as fieldPropTypes } from '../../propTypes';
import FieldCaption from '../FieldCaption';
import FieldComposedOf from '../FieldComposedOf';
import FieldDisplayInput from '../FieldDisplay';
import FieldFormatInput from '../FieldFormatInput';
import FieldWidthInput from '../FieldWidthInput';

interface TabDisplayComponentProps {
    keepMeta?: boolean;
    filter: string;
    fields: unknown[];
    subresourceId?: string;
}

export const TabDisplayComponent = ({
    keepMeta = true,

    filter,

    fields,

    subresourceId
}: TabDisplayComponentProps) => (
    <>
        {keepMeta && <FieldDisplayInput />}
        <FieldFormatInput />
        <FieldWidthInput />
        <FieldCaption
            fields={fields}
            scope={filter}
            subresourceId={subresourceId}
        />
        <FieldComposedOf
            fields={fields}
            scope={filter}
            subresourceId={subresourceId}
        />
    </>
);

export default TabDisplayComponent;
