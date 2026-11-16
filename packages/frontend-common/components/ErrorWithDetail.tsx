import { useState, type MouseEvent } from 'react';
import { Box, Collapse, IconButton, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from '../i18n/I18NContext';

type ErrorWithDetailProps = {
    message: string;
    // technical: hidden until asked for
    detail?: string | null;
    // a link below the message keeps away from the close button of a toast
    toggle?: 'arrow' | 'link';
};

export const ErrorWithDetail = ({
    message,
    detail,
    toggle = 'arrow',
}: ErrorWithDetailProps) => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = (event: MouseEvent) => {
        // a toast closes on click
        event.stopPropagation();
        setIsOpen(!isOpen);
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Box sx={{ flexGrow: 1 }}>{message}</Box>
                {detail && toggle === 'arrow' && (
                    <IconButton
                        color="inherit"
                        size="small"
                        sx={{ p: 0 }}
                        aria-label={translate('error_detail')}
                        aria-expanded={isOpen}
                        onClick={handleToggle}
                    >
                        <ExpandMoreIcon
                            sx={{
                                transform: isOpen ? 'rotate(180deg)' : 'none',
                                transition: 'transform 150ms',
                            }}
                        />
                    </IconButton>
                )}
            </Box>
            {detail && toggle === 'link' && (
                <Link
                    component="button"
                    color="inherit"
                    variant="body2"
                    aria-expanded={isOpen}
                    onClick={handleToggle}
                    sx={{ mt: 0.5 }}
                >
                    {translate(
                        isOpen ? 'hide_error_detail' : 'show_error_detail',
                    )}
                </Link>
            )}
            {detail && (
                <Collapse in={isOpen}>
                    <Box
                        component="pre"
                        sx={{
                            m: 0,
                            mt: 1,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: '0.75rem',
                        }}
                    >
                        {detail}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
};
