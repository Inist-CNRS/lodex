import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../i18n/I18NContext';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colors: MONOCHROMATIC_DEFAULT_COLORSET,
    flipAxis: false,
};

// @ts-expect-error TS7006
const ClusteredChartAdmin = (props) => {
    const { args, p } = props;
    const { params, colors, xTitle, yTitle, flipAxis } = args;

    // @ts-expect-error TS7006
    const handleParams = (params) => {
        updateAdminArgs('params', params, props);
    };

    // @ts-expect-error TS7006
    const handleColors = (colors) => {
        updateAdminArgs('colors', colors || defaultArgs.colors, props);
    };

    // @ts-expect-error TS7006
    const handleXAxisTitle = (event) => {
        updateAdminArgs('xTitle', event.target.value, props);
    };

    // @ts-expect-error TS7006
    const handleYAxisTitle = (event) => {
        updateAdminArgs('yTitle', event.target.value, props);
    };

    const toggleFlipAxis = () => {
        updateAdminArgs('flipAxis', !flipAxis, props);
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={p}
                    onChange={handleParams}
                    showMaxSize
                    showMaxValue
                    showMinValue
                    showOrderBy
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet defaultExpanded>
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
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
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
