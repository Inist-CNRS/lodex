import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { formatAdminStyle } from '../../adminStyles';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Default field set component to use for translating declination
 * @param children {React.ReactNode} Field set content
 * @param title {string} translation key use to get the field set legend
 * @param p {{t: (string) => string}} polyglot use to get the text from a translation key
 * @param defaultExpanded
 * @param id
 * @returns {JSX.Element}
 */
const FormatFieldSet = ({ children, title, p, defaultExpanded, id }) => {
    return (
        <Accordion defaultExpanded={defaultExpanded}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={id}
                id={id}
            >
                <Typography>{p.t(title)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="space-between"
                    gap={2}
                    style={formatAdminStyle.box}
                >
                    {children}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

FormatFieldSet.defaultProps = {
    defaultExpanded: false,
};

FormatFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    defaultExpanded: PropTypes.bool,
    id: PropTypes.string.isRequired,
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
        <TranslatedVegaFieldSet
            title="format_default_params"
            id="format-field-set-default-param"
        >
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
        <TranslatedVegaFieldSet
            title="format_data_params"
            id="format-field-set-data-param"
        >
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
        <TranslatedVegaFieldSet
            title="format_chart_params"
            id="format-field-set-chart-param"
        >
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
        <TranslatedVegaFieldSet
            title="format_sub_format_params"
            id="format-field-set-sub-format-param"
        >
            {children}
        </TranslatedVegaFieldSet>
    );
};

FormatSubFormatParamsFieldSet.propTypes = {
    children: PropTypes.node.isRequired,
};
