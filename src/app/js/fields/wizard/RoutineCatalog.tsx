import React from 'react';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';
import compose from 'recompose/compose';

import {
    List,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    ListItem,
    Box,
    Link,
    Tooltip,
} from '@mui/material';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import routines from '../../../custom/routines/routines-catalog.json';
import routinesPrecomputed from '../../../custom/routines/routines-precomputed-catalog.json';
import CancelButton from '@lodex/frontend-common/components/CancelButton';

const styles = {
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--neutral-dark-very-light)',
        },
        borderBottom: `1px solid var(--neutral-dark-light)`,
    },
    selectedItem: {
        backgroundColor: 'var(--primary-secondary)',
        '&:hover': {
            backgroundColor: 'var(--primary-main)',
        },
        '& a': {
            color: 'var(--contrast-main)',
        },
    },
};

interface RoutineCatalogDescriptionProps {
    routine: {
        id: string;
        doc?: string;
        url?: string;
        recommendedWith?: unknown[];
    };
    polyglot: unknown;
}

const RoutineCatalogDescription = ({
    routine,
    polyglot,
}: RoutineCatalogDescriptionProps) => {
    return (
        <React.Fragment>
            {/*
             // @ts-expect-error TS18046 */}
            <Typography>{polyglot.t(`${routine.id}_description`)}</Typography>
            <Box justifyContent="space-between" display="flex" mt={2}>
                {routine.recommendedWith && (
                    // @ts-expect-error TS18046
                    <Tooltip title={polyglot.t(`tooltip_recommendedWith`)}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <ThumbUpIcon color="primary" />
                            <Typography>
                                {routine.recommendedWith.toString()}
                            </Typography>
                        </Box>
                    </Tooltip>
                )}
                {routine.doc && (
                    // @ts-expect-error TS18046
                    <Tooltip title={polyglot.t(`tooltip_documentation`)}>
                        <Link
                            href={routine.doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SettingsEthernetIcon />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </React.Fragment>
    );
};

interface RoutineCatalogProps {
    isOpen: boolean;
    handleClose(...args: unknown[]): unknown;
    p: unknown;
    onChange(...args: unknown[]): unknown;
    currentValue?: string;
    precomputed?: boolean;
}

const RoutineCatalog = ({
    p: polyglot,

    isOpen,

    handleClose,

    onChange,

    currentValue,

    precomputed = false,
}: RoutineCatalogProps) => {
    // @ts-expect-error TS7006
    const handleValueChange = (newValue) => {
        const event = { target: { value: newValue } };
        onChange(event);
        handleClose();
    };

    // @ts-expect-error TS7006
    const scrollTo = (el) => {
        if (el) {
            el.scrollIntoView({ inline: 'center', block: 'center' });
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogContent sx={{ padding: 0, width: '1100px' }}>
                <List
                    component="nav"
                    aria-label="format list"
                    sx={{ height: '70vh' }}
                >
                    {(precomputed ? routinesPrecomputed : routines).map(
                        (routine) => (
                            <ListItem
                                key={routine.id}
                                onClick={() => handleValueChange(routine.url)}
                                sx={{
                                    ...styles.item,
                                    ...(currentValue?.includes(routine.url)
                                        ? styles.selectedItem
                                        : {}),
                                }}
                                ref={
                                    currentValue?.includes(routine.url)
                                        ? scrollTo
                                        : null
                                }
                            >
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            {/*
                                             // @ts-expect-error TS18046 */}
                                            {polyglot.t(`${routine.id}_title`)}
                                        </Typography>
                                    }
                                    secondary={
                                        <RoutineCatalogDescription
                                            routine={routine}
                                            polyglot={polyglot}
                                        />
                                    }
                                />
                            </ListItem>
                        ),
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <CancelButton key="cancel" onClick={handleClose}>
                    {/*
                     // @ts-expect-error TS18046 */}
                    {polyglot.t('cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

// @ts-expect-error TS2345
export default compose(translate)(RoutineCatalog);
