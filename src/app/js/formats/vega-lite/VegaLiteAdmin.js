import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Box, TextField } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';
import VegaAdvancedMode from '../vega-utils/components/VegaAdvancedMode';
import VegaFieldSet from '../vega-utils/components/VegaFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    specTemplate:
        '{"width": 600, "autosize": {"type": "fit", "contains": "padding" }, "mark": "bar", "encoding": { "x": {"field": "_id", "type": "ordinal"}, "y": {"field": "value", "type": "quantitative"} }, "data": {"name": "values"} }',
    width: '',
    height: '',
};

const VegaLiteAdmin = props => {
    const {
        args,
        p,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;
    const { specTemplate, width, height, params } = args;

    const formattedSpecTemplate = useMemo(() => {
        try {
            return JSON.stringify(JSON.parse(specTemplate), null, 2);
        } catch (e) {
            return specTemplate;
        }
    }, [specTemplate]);

    const handleParams = params => {
        updateAdminArgs('params', params, props);
    };

    const handleSpecTemplate = value => {
        updateAdminArgs('specTemplate', value, props);
    };

    const handleWidth = e => {
        updateAdminArgs('width', e.target.value, props);
    };

    const handleHeight = e => {
        updateAdminArgs('height', e.target.value, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <VegaFieldSet title={p.t('vega_chart_data_params')}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    polyglot={p}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </VegaFieldSet>
            <VegaFieldSet title={p.t('vega_chart_params')}>
                <Box width="100%">
                    <VegaAdvancedMode
                        value={formattedSpecTemplate}
                        onChange={handleSpecTemplate}
                    />
                    <a
                        href="https://vega.github.io/vega-lite/docs/size.html#specifying-width-and-height-per-discrete-step"
                        target="_blank"
                        rel="noopener nofollow noreferrer"
                    >
                        {p.t('vega_size_step')}
                    </a>
                </Box>
                <TextField
                    type="number"
                    min={10}
                    max={200}
                    step={10}
                    label={p.t('vegalite_width')}
                    onChange={handleWidth}
                    value={width}
                    fullWidth
                    InputProps={{
                        endAdornment: '%',
                    }}
                />
                <TextField
                    type="number"
                    min={10}
                    max={800}
                    step={10}
                    label={p.t('vegalite_height')}
                    onChange={handleHeight}
                    value={height}
                    fullWidth
                    InputProps={{
                        endAdornment: '%',
                    }}
                />
            </VegaFieldSet>
        </Box>
    );
};

VegaLiteAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

VegaLiteAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        specTemplate: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

export default translate(VegaLiteAdmin);
