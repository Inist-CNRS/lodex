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
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    ListItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';
import classNames from 'classnames';

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
    list: {
        width: 1050,
        height: '70vh',
    },
});

export const FormatCatalog = ({
    p: polyglot,
    formats,
    isOpen,
    handleClose,
    onChange,
    currentValue,
}) => {
    const classes = useStyles();
    const filters = [...new Set(formats.map(item => item.type))];
    filters.unshift('all');
    const otherIndex = filters.indexOf('other');
    if (otherIndex !== -1) {
        filters.splice(otherIndex, 1);
        filters.push('other');
    }

    const [filteredFormats, setFilterFormats] = useState(formats);
    const [selectedFilter, setSelectedFilter] = useState();

    useEffect(() => {
        setFilterFormats(
            selectedFilter
                ? formats.filter(item => item.type === selectedFilter)
                : formats,
        );
    }, [selectedFilter]);

    const handleValueChange = newValue => {
        onChange(newValue);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogTitle>
                <Grid
                    container={true}
                    direction="row"
                    style={{ width: '100%', marginBottom: 25 }}
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
                                onClick={() =>
                                    setSelectedFilter(
                                        filter === 'all' ? null : filter,
                                    )
                                }
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
            </DialogTitle>
            <DialogContent>
                <List
                    component="nav"
                    aria-label="format list"
                    className={classes.list}
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
                        >
                            <ListItemText
                                primary={polyglot.t(format.name)}
                                secondary={polyglot.t(format.description)}
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

FormatCatalog.propTypes = {
    formats: PropTypes.arrayOf(PropTypes.object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.object,
};

export default compose(translate)(FormatCatalog);
