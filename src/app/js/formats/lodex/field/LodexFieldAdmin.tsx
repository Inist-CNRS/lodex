import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import { useTranslate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    param: {
        labelArray: [''],
    },
};

interface LodexFieldAdminProps {
    args?: {
        param?: {
            labelArray?: string[];
            hiddenInfo?: object;
        };
    };
    onChange(...args: unknown[]): unknown;
}

const LodexFieldAdmin = ({
    args = defaultArgs,
    onChange,
}: LodexFieldAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleRequest = (e) => {
        const labelArray = (e.target.value || '').split(';');
        const { param, ...argsRest } = args;
        const newArgs = { ...argsRest, param: { ...param, labelArray } };
        onChange(newArgs);
    };

    // @ts-expect-error TS7006
    const handleHiddenInfo = (event) => {
        const hiddenInfo = event.target.checked;
        const { param, ...state } = args;
        const newState = { ...state, param: { ...param, hiddenInfo } };
        onChange(newState);
    };

    const { param } = args || defaultArgs;
    const { labelArray = [], hiddenInfo = false } = param || {};
    const label = labelArray.join(';');

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <TextField
                    label={translate('param_labels')}
                    multiline
                    onChange={handleRequest}
                    value={label}
                    fullWidth
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={handleHiddenInfo}
                            checked={Boolean(hiddenInfo)}
                        />
                    }
                    label={translate('hidden_info')}
                />
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default LodexFieldAdmin;
