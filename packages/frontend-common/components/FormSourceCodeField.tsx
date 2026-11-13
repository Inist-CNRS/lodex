import { useController } from 'react-hook-form';
import SourceCodeField from './SourceCodeField';

type SourceCodeFieldProps = {
    name: string;
    label: string;
    mode?: 'ini' | 'json';
    width?: string;
    height?: string;
};

export const FormSourceCodeField = ({
    name,
    label,
    mode = 'ini',
    width,
    height,
}: SourceCodeFieldProps) => {
    const { field } = useController({
        name,
    });

    return (
        <SourceCodeField
            input={{
                onChange: field.onChange,
                value: field.value,
            }}
            label={label}
            mode={mode}
            width={width}
            height={height}
        />
    );
};

export default FormSourceCodeField;
