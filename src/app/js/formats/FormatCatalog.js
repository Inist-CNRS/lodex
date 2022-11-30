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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';
import { ListItemButton } from '@mui/material';

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
        width: 800,
        height: '70vh',
    },
});

export const FormatCatalog = ({
    p: polyglot,
    formats,
    isOpen,
    handleClose,
    onChange,
}) => {
    const classes = useStyles();
    const filters = [...new Set(formats.map(item => item.type))];

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
                            onClick={() => setSelectedFilter()}
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
                                {filter}
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
                        <ListItemButton
                            key={format.name}
                            onClick={() =>
                                handleValueChange(format.componentName)
                            }
                        >
                            <ListItemText
                                primary={format.name}
                                secondary={format.description}
                            />
                        </ListItemButton>
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
};

export default compose(translate)(FormatCatalog);
