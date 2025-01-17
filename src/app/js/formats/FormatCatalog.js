import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FilterIcon from '@mui/icons-material/FilterList';
import {
    List,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    ListItem,
    Typography,
    Tooltip,
    Link,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CancelButton from '../lib/components/CancelButton';
import { translate } from '../i18n/I18NContext';

const FormatCatalogDescription = ({ format, polyglot }) => {
    return (
        <React.Fragment>
            <Typography>{polyglot.t(`${format.description}`)}</Typography>
            <Box justifyContent="flex-end" display="flex" mt={2}>
                {format.docUrl && (
                    <Tooltip title={polyglot.t(`tooltip_documentation`)}>
                        <Link
                            href={format.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MenuBookIcon />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </React.Fragment>
    );
};

export const FormatCatalog = ({
    p: polyglot,
    formats,
    isOpen,
    handleClose,
    onChange,
    currentValue,
}) => {
    const filters = [...new Set(formats.map((item) => item.type))].sort(
        (x, y) => polyglot.t(x).localeCompare(polyglot.t(y)),
    );
    filters.unshift('all');
    filters.push(filters.splice(filters.indexOf('other'), 1)[0]);

    const [filteredFormats, setFilterFormats] = useState(formats);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        setFilterFormats(
            selectedFilter && selectedFilter !== 'all'
                ? formats.filter((item) => item.type === selectedFilter)
                : formats,
        );
    }, [selectedFilter]);

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
            <DialogContent sx={{ padding: 0, width: '1100px' }}>
                <Grid
                    container={true}
                    direction="row"
                    sx={{
                        width: '100%',
                        marginBottom: '25px',
                        marginTop: '25px',
                        padding: '10px',
                    }}
                    justifyContent="space-around"
                >
                    <Box>
                        <FilterIcon fontSize="large" sx={{ marginRight: 10 }} />
                    </Box>
                    {filters.map((filter) => (
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
                    {filteredFormats.map((format) => (
                        <ListItem
                            key={format.name}
                            onClick={() =>
                                handleValueChange(format.componentName)
                            }
                            sx={{
                                cursor: 'pointer',
                                borderBottom: `1px solid var(--neutral-dark-light)`,
                                backgroundColor:
                                    currentValue === format.componentName
                                        ? 'var(--primary-secondary)'
                                        : 'transparent',
                                '&:hover': {
                                    backgroundColor:
                                        currentValue === format.componentName
                                            ? 'var(--primary-main)'
                                            : 'var(--neutral-dark-very-light)',
                                },
                            }}
                            ref={
                                currentValue === format.componentName
                                    ? scrollTo
                                    : null
                            }
                            data-value={format.componentName}
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {polyglot.t(format.name)}
                                    </Typography>
                                }
                                secondary={
                                    <FormatCatalogDescription
                                        format={format}
                                        polyglot={polyglot}
                                    />
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <CancelButton variant="text" onClick={handleClose}>
                    {polyglot.t('cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

FormatCatalogDescription.propTypes = {
    format: PropTypes.shape({
        description: PropTypes.string.isRequired,
        docUrl: PropTypes.string,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

FormatCatalog.propTypes = {
    formats: PropTypes.arrayOf(PropTypes.object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.string,
};

export default translate(FormatCatalog);
