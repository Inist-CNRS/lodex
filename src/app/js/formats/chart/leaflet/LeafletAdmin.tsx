// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatDataParamsFieldSet,
    FormatChartParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate } from '../../../i18n/I18NContext';
import { TextField } from '@mui/material';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    zoom: 5,
};

const LeafletAdmin = ({
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
    // @ts-expect-error TS7006
    const handleParams = (params) => {
        updateAdminArgs('params', params, { args, onChange });
    };
    // @ts-expect-error TS7006
    const handleZoom = (e) => {
        // @ts-expect-error TS2532
        updateAdminArgs('zoom', e.target.value, this.props);
    };

    const { zoom } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
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
            <FormatChartParamsFieldSet defaultExpanded>
                <TextField
                    label={polyglot.t('zoomByDefault')}
                    onChange={handleZoom}
                    value={zoom}
                    fullWidth
                />
            </FormatChartParamsFieldSet>
        </FormatGroupedFieldSet>
    );
};

LeafletAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
            zoom: PropTypes.number,
        }),
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool,
    showMaxValue: PropTypes.bool,
    showMinValue: PropTypes.bool,
    showOrderBy: PropTypes.bool,
};

export default translate(LeafletAdmin);
