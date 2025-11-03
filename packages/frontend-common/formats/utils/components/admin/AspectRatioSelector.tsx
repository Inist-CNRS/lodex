import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import { MenuItem, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface AspectRatioSelectorProps {
    value: string;
    onChange(...args: unknown[]): unknown;
}

const AspectRatioSelector = ({ value, onChange }: AspectRatioSelectorProps) => {
    const { translate } = useTranslate();
    const [aspectRatio, setAspectRatio] = useState(value);

    const aspectRatios = useMemo(() => {
        return ASPECT_RATIOS.map((ratio) => {
            if (ratio === ASPECT_RATIO_NONE) {
                return {
                    id: ASPECT_RATIO_NONE,
                    label: translate('aspect_ratio_none'),
                };
            }
            return {
                id: ratio,
                label: ratio,
            };
        });
    }, []);

    // @ts-expect-error TS7006
    const handleAspectRatio = (event) => {
        setAspectRatio(event.target.value);
        onChange(event.target.value);
    };

    return (
        <TextField
            fullWidth
            select
            label={translate('aspect_ratio')}
            onChange={handleAspectRatio}
            value={aspectRatio}
        >
            {aspectRatios.map(({ id: aspectRatio, label }) => (
                <MenuItem key={aspectRatio} value={aspectRatio}>
                    {label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default AspectRatioSelector;
