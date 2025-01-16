import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import { MenuItem, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import translate from 'redux-polyglot/translate';

const AspectRatioSelector = ({ value, onChange, p }) => {
    const [aspectRatio, setAspectRatio] = useState(value);

    const aspectRatios = useMemo(() => {
        return ASPECT_RATIOS.map((ratio) => {
            if (ratio === ASPECT_RATIO_NONE) {
                return p.t('aspect_ratio_none');
            }
            return ratio;
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
            {aspectRatios.map((aspectRatio) => (
                <MenuItem key={aspectRatio} value={aspectRatio}>
                    {aspectRatio}
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
