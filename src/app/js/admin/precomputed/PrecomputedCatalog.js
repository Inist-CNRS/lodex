import React from 'react';
import PropTypes from 'prop-types';
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
import { useTranslate } from '../../i18n/I18NContext';

const styles = {
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--neutral-dark-very-light)',
        },
        borderBottom: `1px solid var(--neutral-dark-light)`,
    },
    selectedItem: {
        backgroundColor: 'var(adminTheme.palette.primary.secondary)',
        '&:hover': {
            backgroundColor: 'var(--primary-main)',
        },
        '& a': {
            color: 'var(--contrast-main)',
        },
    },
};

const PrecomputerDescription = ({ precomputer }) => {
    const { translate } = useTranslate();
    return (
        <>
            <Typography>
                {translate(`pc_${precomputer.id}_description`)}
            </Typography>
            <Box justifyContent="flex-end" display="flex">
                {precomputer.doc && (
                    <Tooltip title={translate(`tooltip_documentation`)}>
                        <Link
                            href={precomputer.doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: '1em' }}
                            onClick={(e) => e.stopPropagation()}
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
    isOpen,
    handleClose,
    onChange,
    selectedWebServiceUrl,
}) => {
    const { translate } = useTranslate();
    const handleValueChange = (newValue) => {
        onChange(newValue);
        handleClose();
    };

    const scrollTo = (el) => {
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
                    {precomputers.map((precomputer) => (
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
                                        {translate(
                                            `pc_${precomputer.id}_title`,
                                        )}
                                    </Typography>
                                }
                                secondary={
                                    <PrecomputerDescription
                                        precomputer={precomputer}
                                    />
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <CancelButton key="cancel" onClick={handleClose}>
                    {translate('cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

PrecomputedCatalog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedWebServiceUrl: PropTypes.string,
};

PrecomputerDescription.propTypes = {
    precomputer: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
    }).isRequired,
};

export default PrecomputedCatalog;
