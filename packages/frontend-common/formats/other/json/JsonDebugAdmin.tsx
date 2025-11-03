import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { useTranslate } from '../../../i18n/I18NContext';
import { useCallback, type ChangeEvent } from 'react';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    debugMode: false,
};

type JsonDebugArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
    };
    debugMode?: boolean;
};

type JsonDebugAdminProps = {
    args?: JsonDebugArgs;
    onChange: (args: JsonDebugArgs) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
};

const JsonDebugAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: JsonDebugAdminProps) => {
    const { params, debugMode } = args;

    const { translate } = useTranslate();

    const handleParams = useCallback(
        (params: JsonDebugArgs['params']) => {
            onChange({
                ...args,
                params,
            });
        },
        [onChange, args],
    );

    const toggleDebugMode = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange({
                ...args,
                debugMode: event.target.checked,
            });
        },
        [onChange, args],
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={debugMode}
                                onChange={toggleDebugMode}
                            />
                        }
                        label={translate('debugMode')}
                    />
                </FormGroup>
            </FormatDefaultParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

export default JsonDebugAdmin;
