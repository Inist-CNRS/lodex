import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';
import { Box } from '@mui/material';

const ParallelCoordinatesChartAdmin = ({
    p: polyglot,
    args,
    onChange,
    showMaxSize,
    showMaxValue,
    showMinValue,
}) => {
    const setParams = params => {
        updateAdminArgs(
            'params',
            { ...args.params, ...params },
            {
                args,
                onChange,
            },
        );
    };

    const setColors = colors => {
        updateAdminArgs('colors', colors, {
            args,
            onChange,
        });
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <RoutineParamsAdmin
                params={args.params}
                onChange={setParams}
                polyglot={polyglot}
                showMaxSize={showMaxSize}
                showMaxValue={showMaxValue}
                showMinValue={showMinValue}
            />
            <ColorPickerParamsAdmin
                colors={args.colors}
                onChange={setColors}
                polyglot={polyglot}
            />
        </Box>
    );
};

ParallelCoordinatesChartAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
        }),
        colors: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool,
    showMaxValue: PropTypes.bool,
    showMinValue: PropTypes.bool,
};

export const defaultArgs = {
    params: {
        maxSize: 20,
        maxValue: 100,
        minValue: 0,
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

ParallelCoordinatesChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
};

export default translate(ParallelCoordinatesChartAdmin);
