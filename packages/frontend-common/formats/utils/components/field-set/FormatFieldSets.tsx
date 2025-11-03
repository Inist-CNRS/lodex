import { type ReactNode } from 'react';
import { formatAdminStyle } from '../../adminStyles';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

type FormatFieldSetProps = {
    children: ReactNode;
    title: string;
    defaultExpanded?: boolean;
    id: string;
};

const FormatFieldSet = ({
    children,
    title,
    defaultExpanded = false,
    id,
}: FormatFieldSetProps) => {
    const { translate } = useTranslate();
    return (
        <Accordion defaultExpanded={defaultExpanded}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={id}
                id={id}
            >
                <Typography>{translate(title)}</Typography>
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

type FormatDefaultParamsFieldSetProps = {
    children: React.ReactNode;
    defaultExpanded?: boolean;
};

export const FormatDefaultParamsFieldSet = ({
    children,
    defaultExpanded,
}: FormatDefaultParamsFieldSetProps) => {
    return (
        <FormatFieldSet
            title="format_default_params"
            id="format-field-set-default-param"
            defaultExpanded={defaultExpanded}
        >
            {children}
        </FormatFieldSet>
    );
};

type FormatDataParamsFieldSetProps = {
    children: ReactNode;
    defaultExpanded?: boolean;
};

export const FormatDataParamsFieldSet = ({
    children,
    defaultExpanded,
}: FormatDataParamsFieldSetProps) => {
    return (
        <FormatFieldSet
            title="format_data_params"
            id="format-field-set-data-param"
            defaultExpanded={defaultExpanded}
        >
            {children}
        </FormatFieldSet>
    );
};

type FormatChartParamsFieldSetProps = {
    children: ReactNode;
    defaultExpanded?: boolean;
};

export const FormatChartParamsFieldSet = ({
    children,
    defaultExpanded,
}: FormatChartParamsFieldSetProps) => {
    return (
        <FormatFieldSet
            title="format_chart_params"
            id="format-field-set-chart-param"
            defaultExpanded={defaultExpanded}
        >
            {children}
        </FormatFieldSet>
    );
};

type FormatSubFormatParamsFieldSetProps = {
    children: ReactNode;
    defaultExpanded?: boolean;
};

export const FormatSubFormatParamsFieldSet = ({
    children,
    defaultExpanded,
}: FormatSubFormatParamsFieldSetProps) => {
    return (
        <FormatFieldSet
            title="format_sub_format_params"
            id="format-field-set-sub-format-param"
            defaultExpanded={defaultExpanded}
        >
            {children}
        </FormatFieldSet>
    );
};
