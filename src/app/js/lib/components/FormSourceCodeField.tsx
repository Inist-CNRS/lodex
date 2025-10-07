import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-ejs';
import 'ace-builds/src-noconflict/theme-monokai';

import { useController } from 'react-hook-form';
import SourceCodeField from './SourceCodeField';

type SourceCodeFieldProps = {
    name: string;
    label: string;
    enableModeSelector?: boolean;
    mode?: 'ini' | 'json';
    width?: string;
    height?: string;
};

export const FormSourceCodeField = ({
    name,
    label,
    enableModeSelector = false,
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
            enableModeSelector={enableModeSelector}
            label={label}
            mode={mode}
            width={width}
            height={height}
        />
    );
};

export default FormSourceCodeField;
