import React, { useEffect, useState } from 'react';
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
    Button,
    Typography,
    Link,
    ListItem,
    Box,
    Tooltip,
    Grid,
} from '@mui/material';
import enrichers from '../../../custom/enrichers/enrichers-catalog.json';
import FilterIcon from '@mui/icons-material/FilterList';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
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

const EnricherDescription = ({ enricher, polyglot }) => {
    return (
        <React.Fragment>
            <Typography>
                {polyglot.t(`ws_${enricher.id}_description`)}
            </Typography>
            <Box justifyContent="flex-end" display="flex">
                {enricher.objectifTDM && (
                    <Tooltip title={polyglot.t(`tooltip_objectifTDM`)}>
                        <Link
                            href={enricher.objectifTDM}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: '1em' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <MenuBookIcon />
                        </Link>
                    </Tooltip>
                )}
                {enricher.swagger && (
                    <Tooltip title={polyglot.t(`tooltip_swagger`)}>
                        <Link
                            href={enricher.swagger}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                        >
                            <SettingsEthernetIcon />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </React.Fragment>
    );
};

export const EnrichmentCatalog = ({
    p: polyglot,
    isOpen,
    handleClose,
    onChange,
    selectedWebServiceUrl,
}) => {
    const filters = [
        ...new Set(enrichers.map(item => item.type)),
    ].sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)));
    filters.unshift('all');
    filters.push(filters.splice(filters.indexOf('other'), 1)[0]);

    const [filteredEnricher, setFilterEnricher] = useState(enrichers);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        setFilterEnricher(
            selectedFilter && selectedFilter !== 'all'
                ? enrichers.filter(item => item.type === selectedFilter)
                : enrichers,
        );
    }, [selectedFilter]);

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
                <Grid
                    container={true}
                    direction="row"
                    style={{
                        width: '100%',
                        marginBottom: 25,
                        marginTop: 25,
                        padding: 10,
                    }}
                    justifyContent="space-around"
                    spacing={2}
                >
                    <Box>
                        <FilterIcon
                            fontSize="large"
                            style={{ marginRight: 10 }}
                        />
                    </Box>
                    {filters.map(filter => (
                        <Box key={filter}>
                            <Button
                                color="primary"
                                className="format-category"
                                onClick={() => setSelectedFilter(filter)}
                                variant={
                                    filter === selectedFilter
                                        ? 'contained'
                                        : 'outlined'
                                }
                            >
                                {polyglot.t(filter)}
                            </Button>
                        </Box>
                    ))}
                </Grid>
                <List
                    component="nav"
                    aria-label="format list"
                    style={{ height: '70vh' }}
                >
                    {filteredEnricher.map(enricher => (
                        <ListItem
                            key={enricher.id}
                            onClick={() => handleValueChange(enricher.url)}
                            sx={{
                                ...styles.item,
                                ...(selectedWebServiceUrl === enricher.url
                                    ? styles.selectedItem
                                    : {}),
                            }}
                            ref={
                                selectedWebServiceUrl === enricher.url
                                    ? scrollTo
                                    : null
                            }
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {polyglot.t(`ws_${enricher.id}_title`)}
                                    </Typography>
                                }
                                secondary={
                                    <EnricherDescription
                                        enricher={enricher}
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

EnrichmentCatalog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedWebServiceUrl: PropTypes.string,
};

EnricherDescription.propTypes = {
    enricher: PropTypes.shape({
        id: PropTypes.string.isRequired,
        doc: PropTypes.string,
        swagger: PropTypes.string,
        objectifTDM: PropTypes.string,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default compose(translate)(EnrichmentCatalog);
