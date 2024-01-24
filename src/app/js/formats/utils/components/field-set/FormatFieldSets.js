import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { formatAdminStyle } from '../../adminStyles';

/**
 * Default field set component to use for translating declination
 * @param children {React.ReactNode} Field set content
 * @param title {string} translation key use to get the field set legend
 * @param p {{t: (string) => string}} polyglot use to get the text from a translation key
 * @returns {JSX.Element}
 */
const FormatFieldSet = ({ children, title, p }) => {
    return (
        <fieldset style={formatAdminStyle.fieldset}>
            <legend style={formatAdminStyle.legend}>{p.t(title)}</legend>
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
                style={formatAdminStyle.box}
            >
                {children}
            </Box>
        </fieldset>
    );
};

FormatFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

/**
 * Polyglot injected FormatFieldSet component
 */
const TranslatedVegaFieldSet = translate(FormatFieldSet);

/**
 * Default translation for the field set component
 * @param children {React.ReactNode} Field set content
 * @returns {JSX.Element}
 */
export const FormatDefaultParamsFieldSet = ({ children }) => {
    return (
        <TranslatedVegaFieldSet title="format_default_params">
            {children}
        </TranslatedVegaFieldSet>
    );
};

FormatDefaultParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Format data parameters translation for the field set component
 * @param children {React.ReactNode} Field set content
 * @returns {JSX.Element}
 */
export const FormatDataParamsFieldSet = ({ children }) => {
    return (
        <TranslatedVegaFieldSet title="format_data_params">
            {children}
        </TranslatedVegaFieldSet>
    );
};

FormatDataParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Format chart parameters translation for the field set component
 * @param children {React.ReactNode} Field set content
 * @returns {JSX.Element}
 */
export const FormatChartParamsFieldSet = ({ children }) => {
    return (
        <TranslatedVegaFieldSet title="format_chart_params">
            {children}
        </TranslatedVegaFieldSet>
    );
};

FormatChartParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Format sub-format parameters translation for the field set component
 * @param children {React.ReactNode} Field set content
 * @returns {JSX.Element}
 */
export const FormatSubFormatParamsFieldSet = ({ children }) => {
    return (
        <TranslatedVegaFieldSet title="format_sub_format_params">
            {children}
        </TranslatedVegaFieldSet>
    );
};

FormatSubFormatParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};
