import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import { MenuItem, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { translate } from '../../../../i18n/I18NContext';

interface AspectRatioSelectorProps {
    value: string;
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

const AspectRatioSelector = ({
    value,
    onChange,
    p,
}: AspectRatioSelectorProps) => {
    const [aspectRatio, setAspectRatio] = useState(value);

    const aspectRatios = useMemo(() => {
        return ASPECT_RATIOS.map((ratio) => {
            if (ratio === ASPECT_RATIO_NONE) {
                return {
                    id: ASPECT_RATIO_NONE,
                    // @ts-expect-error TS18046
                    label: p.t('aspect_ratio_none'),
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
            // @ts-expect-error TS18046
            label={p.t('aspect_ratio')}
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

export default translate(AspectRatioSelector);
