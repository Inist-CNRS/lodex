import {
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
} from '@mui/material';

import { useTranslate } from '../../../../i18n/I18NContext';

export type RoutineParams = {
    maxSize?: number;
    maxValue?: number;
    minValue?: number;
    orderBy?: string;
    uri?: string;
};

type RoutineParamsAdminProps = {
    params: RoutineParams;
    onChange: (params: RoutineParams) => void;
    showMaxSize?: boolean;
    showMaxValue?: boolean;
    showMinValue?: boolean;
    showOrderBy?: boolean;
    showUri?: boolean;
};

const RoutineParamsAdmin = ({
    onChange,
    params: { maxSize, maxValue, minValue, orderBy, uri },
    showUri,
    showMaxSize,
    showMaxValue,
    showMinValue,
    showOrderBy,
}: RoutineParamsAdminProps) => {
    const { translate } = useTranslate();
    // @ts-expect-error TS7006
    const handleMaxSize = (e) => {
        onChange({
            maxSize: e.target.value,
            maxValue,
            minValue,
            orderBy,
            uri,
        });
    };

    // @ts-expect-error TS7006
    const handleMaxValue = (e) => {
        onChange({
            maxSize,
            maxValue: e.target.value,
            minValue,
            orderBy,
            uri,
        });
    };

    // @ts-expect-error TS7006
    const handleMinValue = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue: e.target.value,
            orderBy,
            uri,
        });
    };

    // @ts-expect-error TS7006
    const handleSortField = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: `${e.target.value}/${orderBy?.split('/')[1]}`,
            uri,
        });
    };

    // @ts-expect-error TS7006
    const handleSortOrder = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy: `${orderBy?.split('/')[0]}/${e.target.value}`,
            uri,
        });
    };

    // @ts-expect-error TS7006
    const handleUri = (e) => {
        onChange({
            maxSize,
            maxValue,
            minValue,
            orderBy,
            uri: e.target.value,
        });
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} width="100%">
            {showMaxSize && (
                <TextField
                    label={translate('max_fields')}
                    onChange={handleMaxSize}
                    value={maxSize}
                    sx={{ width: '50%' }}
                />
            )}
            {(showMinValue || showMaxValue) && (
                <Box display="flex" gap={1}>
                    {showMinValue && (
                        <TextField
                            label={translate('min_value')}
                            onChange={handleMinValue}
                            value={minValue}
                            fullWidth
                        />
                    )}
                    {showMaxValue && (
                        <TextField
                            label={translate('max_value')}
                            onChange={handleMaxValue}
                            value={maxValue}
                            fullWidth
                        />
                    )}
                </Box>
            )}
            {showOrderBy && (
                <Box>
                    <Typography>{translate('order_by')}</Typography>
                    <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                        <RadioGroup
                            value={orderBy?.split('/')[0]}
                            onChange={handleSortField}
                            name="sort-field"
                        >
                            <FormControlLabel
                                value="_id"
                                control={<Radio />}
                                label={translate('label')}
                            />
                            <FormControlLabel
                                value="value"
                                control={<Radio />}
                                label={translate('value')}
                            />
                        </RadioGroup>
                        <RadioGroup
                            value={orderBy?.split('/')[1]}
                            onChange={handleSortOrder}
                            name="sort-order"
                        >
                            <FormControlLabel
                                value="asc"
                                control={<Radio />}
                                label={translate('asc')}
                            />
                            <FormControlLabel
                                value="desc"
                                control={<Radio />}
                                label={translate('desc')}
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
            )}
            {showUri && (
                <TextField
                    label={translate('uri')}
                    onChange={handleUri}
                    value={uri}
                    sx={{ width: '50%' }}
                />
            )}
        </Box>
    );
};

export default RoutineParamsAdmin;
