import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FilterIcon from '@material-ui/icons/FilterList';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';
import classNames from 'classnames';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

const useStyles = makeStyles({
    item: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.black.veryLight,
        },
        borderBottom: `1px solid ${theme.black.light}`,
    },
    selectedItem: {
        backgroundColor: theme.green.secondary,
        '&:hover': {
            backgroundColor: theme.green.primary,
        },
    },
});

const FormatCatalogDescription = ({ format, polyglot }) => {
    return (
        <React.Fragment>
            <Typography>{polyglot.t(`${format.description}`)}</Typography>
            <Box justifyContent="flex-end" display="flex" mt={2}>
                {format.doc && (
                    <Tooltip title={polyglot.t(`tooltip_documentation`)}>
                        <Link
                            href={format.doc}
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

export const FormatCatalog = ({
    p: polyglot,
    formats,
    isOpen,
    handleClose,
    onChange,
    currentValue,
}) => {
    const classes = useStyles();
    const filters = [...new Set(formats.map(item => item.type))].sort((x, y) =>
        polyglot.t(x).localeCompare(polyglot.t(y)),
    );
    filters.unshift('all');
    filters.push(filters.splice(filters.indexOf('other'), 1)[0]);

    const [filteredFormats, setFilterFormats] = useState(formats);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        setFilterFormats(
            selectedFilter && selectedFilter !== 'all'
                ? formats.filter(item => item.type === selectedFilter)
                : formats,
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
                >
                    <Box>
                        <FilterIcon
                            fontSize="large"
                            style={{ marginRight: 10, cursor: 'pointer' }}
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
                    {filteredFormats.map(format => (
                        <ListItem
                            key={format.name}
                            onClick={() =>
                                handleValueChange(format.componentName)
                            }
                            className={classNames(classes.item, {
                                [classes.selectedItem]:
                                    currentValue === format.componentName,
                            })}
                            ref={
                                currentValue === format.componentName
                                    ? scrollTo
                                    : null
                            }
                        >
                            <ListItemText
                                primary={polyglot.t(format.name)}
                                primaryTypographyProps={{
                                    style: { fontWeight: 'bold' },
                                }}
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
                <Button
                    variant="text"
                    key="cancel"
                    color="secondary"
                    onClick={handleClose}
                >
                    {polyglot.t('cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

FormatCatalogDescription.propTypes = {
    format: PropTypes.shape({
        description: PropTypes.string.isRequired,
        doc: PropTypes.string,
    }).isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

FormatCatalog.propTypes = {
    formats: PropTypes.arrayOf(PropTypes.object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.object,
};

export default compose(translate)(FormatCatalog);
