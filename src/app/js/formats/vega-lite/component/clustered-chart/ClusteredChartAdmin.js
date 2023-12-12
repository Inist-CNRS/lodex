import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import { FormatChartParamsFieldSet } from '../../../utils/components/FormatFieldSet';

export const defaultArgs = {
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
};

const ClusteredChartAdmin = props => {
    const { args, p } = props;
    const { colors, xTitle, yTitle } = args;

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    const handleXAxisTitle = event => {
        updateAdminArgs('xTitle', event.target.value, props);
    };

    const handleYAxisTitle = event => {
        updateAdminArgs('yTitle', event.target.value, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <FormatChartParamsFieldSet>
                <ColorPickerParamsAdmin
                    colors={colors}
                    onChange={handleColors}
                    polyglot={p}
                />
                <TextField
                    fullWidth
                    label={p.t('format_x_axis_title')}
                    onChange={handleXAxisTitle}
                    value={xTitle}
                />
                <TextField
                    fullWidth
                    label={p.t('format_y_axis_title')}
                    onChange={handleYAxisTitle}
                    value={yTitle}
                />
            </FormatChartParamsFieldSet>
        </Box>
    );
};

ClusteredChartAdmin.defaultProps = {
    args: defaultArgs,
};

ClusteredChartAdmin.propTypes = {
    args: PropTypes.shape({
        colors: PropTypes.string,
        xTitle: PropTypes.string,
        yTitle: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ClusteredChartAdmin);
