import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import ColorPickerParamsAdmin from '../../utils/components/admin/ColorPickerParamsAdmin';
import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
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
    colors: MULTICHROMATIC_DEFAULT_COLORSET,
};

const VennAdmin = ({
    args = defaultArgs,
    // @ts-expect-error TS7031
    onChange,
    // @ts-expect-error TS7031
    p: polyglot,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
}) => {
    const [colors, setColors] = useState(args.colors || defaultArgs.colors);

    // @ts-expect-error TS7006
    const handleParams = (params) => {
        updateAdminArgs('params', params, { args, onChange });
    };

    // @ts-expect-error TS7006
    const handleColors = (newColors) => {
        updateAdminArgs('colors', newColors, { args, onChange });
        setColors(newColors);
    };

    return (
        <FormatGroupedFieldSet>
            {/*
             // @ts-expect-error TS2322 */}
            <FormatDataParamsFieldSet>
                {/*
                 // @ts-expect-error TS2322 */}
                <RoutineParamsAdmin
                    // @ts-expect-error TS2739
                    params={args.params || defaultArgs.params}
                    polyglot={polyglot}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            {/*
             // @ts-expect-error TS2322 */}
            <FormatChartParamsFieldSet defaultExpanded>
                {/*
                 // @ts-expect-error TS2322 */}
                <ColorPickerParamsAdmin
                    colors={colors}
                    onChange={handleColors}
                    polyglot={polyglot}
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

VennAdmin.propTypes = {
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

export default translate(VennAdmin);
