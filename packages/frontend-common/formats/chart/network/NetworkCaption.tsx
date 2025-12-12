import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

export function NetworkCaption({
    captions,
    captionTitle,
}: NetworkCaptionProps) {
    const { translate } = useTranslate();

    if (!captions?.length) {
        return null;
    }

    return (
        <Accordion
            sx={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                borderRadius: '4px',
                width: '256px',
                '&::before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 },
            }}
        >
            <AccordionSummary
                aria-controls="network-caption-details"
                id="network-caption-summary"
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    '&.Mui-expanded': {
                        minHeight: 'fit-content',
                    },
                    '&.Mui-expanded .MuiAccordionSummary-content.Mui-expanded':
                        {
                            margin: '12px 0',
                        },
                }}
            >
                <Typography
                    component="span"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    {captionTitle ?? translate('caption')}
                </Typography>
            </AccordionSummary>
            <AccordionDetails
                id="network-caption-details"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                {captions.map(({ label, color }) => (
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap="8px"
                        key={label}
                    >
                        <Box
                            sx={{
                                minWidth: '32px',
                                width: '32px',
                                minHeight: '24px',
                                height: '24px',
                                backgroundColor: color,
                                borderRadius: '2px',
                                border: '1px solid #00000033',
                            }}
                        />
                        <Tooltip title={label} placement="top">
                            <Typography
                                component="span"
                                sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flexGrow: 1,
                                }}
                            >
                                {label}
                            </Typography>
                        </Tooltip>
                    </Stack>
                ))}
            </AccordionDetails>
        </Accordion>
    );
}

type NetworkCaptionProps = {
    captionTitle?: string;
    captions?: {
        label: string;
        color: string;
    }[];
};
