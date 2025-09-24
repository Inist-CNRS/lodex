import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import { MenuItem, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { translate } from '../../../../i18n/I18NContext';

const AspectRatioSelector = ({ value, onChange, p }) => {
    const [aspectRatio, setAspectRatio] = useState(value);

    const aspectRatios = useMemo(() => {
        return ASPECT_RATIOS.map((ratio) => {
            if (ratio === ASPECT_RATIO_NONE) {
                return {
                    id: ASPECT_RATIO_NONE,
                    label: p.t('aspect_ratio_none'),
                };
            }
            return {
                id: ratio,
                label: ratio,
            };
        });
    }, []);

    const handleAspectRatio = (event) => {
        setAspectRatio(event.target.value);
        onChange(event.target.value);
    };

    return (
        <TextField
            fullWidth
            select
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

AspectRatioSelector.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(AspectRatioSelector);
