import React from 'react';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import ColorPickerParamsAdmin from '../../../shared/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../../colorUtils';
import updateAdminArgs from '../../../shared/updateAdminArgs';
import {
    VegaChartParamsFieldSet,
    VegaDataParamsFieldSet,
} from '../../../vega-utils/components/VegaFieldSet';
import RoutineParamsAdmin from '../../../shared/RoutineParamsAdmin';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    flipAxis: false,
};

const ClusteredChartAdmin = props => {
    const { args, p } = props;
    const { params, colors, xTitle, yTitle, flipAxis } = args;

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const handleColors = colors => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    const handleXAxisTitle = event => {
        updateAdminArgs('xTitle', event.target.value, props);
    };

    const handleYAxisTitle = event => {
        updateAdminArgs('yTitle', event.target.value, props);
    };

    const toggleFlipAxis = () => {
        updateAdminArgs('flipAxis', !flipAxis, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <VegaDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={p}
                    onChange={handleParams}
                    showMaxSize
                    showMaxValue
                    showMinValue
                    showOrderBy
                />
            </VegaDataParamsFieldSet>
            <VegaChartParamsFieldSet>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={toggleFlipAxis}
                            checked={flipAxis}
                        />
                    }
                    label={p.t('flip_axis')}
                />
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
            </VegaChartParamsFieldSet>
        </Box>
    );
};

ClusteredChartAdmin.defaultProps = {
    args: defaultArgs,
};

ClusteredChartAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        colors: PropTypes.string,
        xTitle: PropTypes.string,
        yTitle: PropTypes.string,
        flipAxis: PropTypes.bool,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ClusteredChartAdmin);
