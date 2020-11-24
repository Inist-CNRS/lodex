import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import compose from 'recompose/compose';
import {
    Button,
    Grid,
    Box,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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

export const ListDialogComponent = ({
    p: polyglot,
    loaders,
    value,
    setLoader,
    open,
    handleClose,
    actions,
}) => {
    const classes = useStyles();
    const [filteredLoaders, setFilter] = useState(loaders.map(l => l.name));

    useEffect(() => {
        setFilter(loaders.map(l => l.name));
    }, [loaders]);

    const changeValue = newValue => {
        setLoader(newValue);
        handleClose();
    };

    const loaderNames = loaders
        .map(loader => loader.name)
        .filter(loader => filteredLoaders.includes(loader))
        .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
        .map(pn => (
            <ListItemComponent
                key={pn}
                value={pn}
                title={polyglot.t(pn)}
                comment={polyglot.t(`${pn}-comment`)}
                selected={value === pn}
                changeValue={changeValue}
            />
        ));

    return (
        <Dialog open={open} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogTitle>
                <FilterComponent
                    p={polyglot}
                    loaders={loaders}
                    filter={filteredLoaders}
                    setFilter={setFilter}
                />
            </DialogTitle>
            <DialogContent>
                <List className={classnames(classes.list)}>
                    <ListItemComponent
                        key={'automatic'}
                        value={'automatic'}
                        title={polyglot.t('automatic-loader')}
                        selected={value === 'automatic'}
                        comment={polyglot.t('automatic-loader-comment')}
                        changeValue={changeValue}
                    />
                    {loaderNames}
                </List>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ListDialogComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    loaders: PropTypes.array,
    setLoader: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

const ListItemComponent = ({
    value,
    title,
    comment,
    selected,
    changeValue,
}) => {
    const classes = useStyles();
    return (
        <ListItem
            value={value}
            onClick={() => changeValue(value)}
            className={classnames(classes.item, {
                [classes.selectedItem]: selected,
            })}
        >
            <ListItemText
                primary={title}
                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                secondary={
                    <span dangerouslySetInnerHTML={{ __html: comment }} />
                }
            />
        </ListItem>
    );
};

ListItemComponent.propTypes = {
    selected: PropTypes.bool,
    comment: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

const FilterComponent = ({ loaders, filter, setFilter, p: polyglot }) => {
    const allFilters = {
        allFormat: loaders.map(l => l.name),
        csvFormat: loaders
            .filter(l => l.name.startsWith('csv'))
            .map(l => l.name),
        tsvFormat: loaders
            .filter(l => l.name.startsWith('tsv'))
            .map(l => l.name),
        xmlFormat: loaders
            .filter(l =>
                ['xml', 'rss', 'atom', 'mods', 'tei', 'skos'].includes(l.name),
            )
            .map(l => l.name),
        jsonFormat: loaders
            .filter(l => l.name.startsWith('json'))
            .map(l => l.name),
    };
    allFilters.otherFormat = allFilters.allFormat.filter(
        l =>
            !allFilters.csvFormat.includes(l) &&
            !allFilters.tsvFormat.includes(l) &&
            !allFilters.xmlFormat.includes(l) &&
            !allFilters.jsonFormat.includes(l),
    );

    return (
        <Grid
            container={true}
            direction="row"
            style={{ width: '100%', marginBottom: 25 }}
            justify="space-around"
        >
            <Box>
                <FilterIcon fontSize="large" style={{ marginRight: 10 }} />
            </Box>
            {Object.keys(allFilters).map(key => (
                <Box key={key}>
                    <Button
                        variant={
                            allFilters[key].toString() === filter.toString()
                                ? 'contained'
                                : 'outlined'
                        }
                        color="primary"
                        onClick={() => setFilter(allFilters[key])}
                    >
                        {polyglot.t(key)}
                    </Button>
                </Box>
            ))}
        </Grid>
    );
};

FilterComponent.propTypes = {
    filter: PropTypes.array,
    setFilter: PropTypes.func.isRequired,
    loaders: PropTypes.array.isRequired,
    p: polyglotPropTypes.isRequired,
};

FilterComponent.defaultProps = {
    loaders: [],
};

export default compose(translate)(ListDialogComponent);
