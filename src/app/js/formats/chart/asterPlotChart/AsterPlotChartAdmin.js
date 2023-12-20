import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../shared/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';
import {
    FormatChartParamsFieldSet,
    FormatDataParamsFieldSet,
} from '../../utils/components/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/FormatGroupedFieldSet';

const AsterPlotChartAdmin = ({
    p: polyglot,
    args,
    onChange,
    showMaxSize,
    showMaxValue,
    showMinValue,
    showOrderBy,
}) => {
    const handleParams = params => {
        updateAdminArgs(
            'params',
            { ...args.params, ...params },
            {
                args,
                onChange,
            },
        );
    };

    const handleColors = colors => {
        updateAdminArgs('colors', colors, {
            args,
            onChange,
        });
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={args.params}
                    onChange={handleParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatChartParamsFieldSet>
                <ColorPickerParamsAdmin
                    colors={args.colors}
                    onChange={handleColors}
                    polyglot={polyglot}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

AsterPlotChartAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        colors: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool,
    showMaxValue: PropTypes.bool,
    showMinValue: PropTypes.bool,
    showOrderBy: PropTypes.bool,
};

export const defaultArgs = {
    params: {
        maxSize: 10,
        maxValue: 100,
        minValue: 0,
        orderBy: 'value/asc',
    },
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

AsterPlotChartAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(AsterPlotChartAdmin);
