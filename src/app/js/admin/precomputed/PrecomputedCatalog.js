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
    Link,
    ListItem,
    Box,
    Tooltip,
} from '@mui/material';
import precomputers from '../../../custom/precomputers/precomputers-catalog.json';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CancelButton from '../../lib/components/CancelButton';
import adminTheme from '../../../custom/adminTheme';

const styles = {
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: adminTheme.palette.neutralDark.veryLight,
        },
        borderBottom: `1px solid ${adminTheme.palette.neutralDark.light}`,
    },
    selectedItem: {
        backgroundColor: adminTheme.palette.primary.secondary,
        '&:hover': {
            backgroundColor: adminTheme.palette.primary.main,
        },
        '& a': {
            color: adminTheme.palette.contrast.main,
        },
    },
};

const PrecomputerDescription = ({ precomputer, polyglot }) => {
    return (
        <>
            <Typography>
                {polyglot.t(`pc_${precomputer.id}_description`)}
            </Typography>
            <Box justifyContent="flex-end" display="flex">
                {precomputer.doc && (
                    <Tooltip title={polyglot.t(`tooltip_documentation`)}>
                        <Link
                            href={precomputer.doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: '1em' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <MenuBookIcon />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </>
    );
};

export const PrecomputedCatalog = ({
    p: polyglot,
    isOpen,
    handleClose,
    onChange,
    selectedWebServiceUrl,
}) => {
    const handleValueChange = newValue => {
        onChange(newValue);
        handleClose();
    };

    const scrollTo = el => {
        if (el) {
            el.scrollIntoView({ inline: 'center', block: 'center' });
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogContent style={{ padding: 0, width: '1100px' }}>
                <List
                    component="nav"
                    aria-label="format list"
                    style={{ height: '70vh' }}
                >
                    {precomputers.map(precomputer => (
                        <ListItem
                            key={precomputer.id}
                            onClick={() => handleValueChange(precomputer.url)}
                            sx={{
                                ...styles.item,
                                ...(selectedWebServiceUrl === precomputer.url
                                    ? styles.selectedItem
                                    : {}),
                            }}
                            ref={
                                selectedWebServiceUrl === precomputer.url
                                    ? scrollTo
                                    : null
                            }
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {polyglot.t(
                                            `pc_${precomputer.id}_title`,
                                        )}
                                    </Typography>
                                }
                                secondary={
                                    <PrecomputerDescription
                                        precomputer={precomputer}
                                        polyglot={polyglot}
                                    />
                                }
                            />
                        </ListItem>
                    ))}
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

PrecomputedCatalog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedWebServiceUrl: PropTypes.string,
};

PrecomputerDescription.propTypes = {
    precomputer: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default compose(translate)(PrecomputedCatalog);
