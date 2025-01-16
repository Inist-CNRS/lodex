import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
import CancelButton from '../../lib/components/CancelButton';

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

const RoutineCatalogDescription = ({ routine, polyglot }) => {
    return (
        <React.Fragment>
            <Typography>{polyglot.t(`${routine.id}_description`)}</Typography>
            <Box justifyContent="space-between" display="flex" mt={2}>
                {routine.recommendedWith && (
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

const RoutineCatalog = ({
    p: polyglot,
    isOpen,
    handleClose,
    onChange,
    currentValue,
    precomputed = false,
}) => {
    const handleValueChange = (newValue) => {
        const event = { target: { value: newValue } };
        onChange(event);
        handleClose();
    };

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
                    {polyglot.t('cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

RoutineCatalog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.string,
    precomputed: PropTypes.bool,
};

RoutineCatalogDescription.propTypes = {
    routine: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
        url: PropTypes.string,
        recommendedWith: PropTypes.array,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default compose(translate)(RoutineCatalog);
