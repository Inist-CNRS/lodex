import React from 'react';
import { vegaAdminStyle } from '../adminStyles';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import translate from 'redux-polyglot/translate';

const VegaFieldSet = ({ children, title, p }) => {
    return (
        <fieldset style={vegaAdminStyle.fieldset}>
            <legend style={vegaAdminStyle.legend}>{p.t(title)}</legend>
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
                style={vegaAdminStyle.box}
            >
                {children}
            </Box>
        </fieldset>
    );
};

VegaFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

const TranslatedVegaFieldSet = translate(VegaFieldSet);

export const VegaChartParamsFieldSet = ({ children }) => {
    return (
        <TranslatedVegaFieldSet title="format_chart_params">
            {children}
        </TranslatedVegaFieldSet>
    );
};

VegaChartParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

export const VegaDataParamsFieldSet = ({ children }) => {
    return (
        <TranslatedVegaFieldSet title="format_data_params">
            {children}
        </TranslatedVegaFieldSet>
    );
};

VegaDataParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};
