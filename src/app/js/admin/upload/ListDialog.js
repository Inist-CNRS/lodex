import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import {
    Button,
    Grid,
    Box,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogContent,
    DialogActions,
} from '@mui/material';
import FilterIcon from '@mui/icons-material/FilterList';

import { polyglot as polyglotPropTypes } from '../../propTypes';

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
    },
};

export const ListDialogComponent = ({
    p: polyglot,
    loaders,
    value,
    setLoader,
    open,
    handleClose,
    actions,
}) => {
    const [filteredLoaders, setFilter] = useState(loaders.map((l) => l.name));

    const scrollTo = (el) => {
        if (el) {
            el.scrollIntoView({ inline: 'center', block: 'center' });
        }
    };

    useEffect(() => {
        setFilter(loaders.map((l) => l.name));
    }, [loaders]);

    const changeValue = (newValue) => {
        setLoader(newValue);
        handleClose();
    };

    const loaderNames = loaders
        .map((loader) => loader.name)
        .filter((loader) => filteredLoaders.includes(loader))
        .sort((x, y) => polyglot.t(x).localeCompare(polyglot.t(y)))
        .map((pn) => (
            <ListItemComponent
                key={pn}
                value={pn}
                title={polyglot.t(pn)}
                comment={polyglot.t(`${pn}-comment`)}
                selected={value === pn}
                changeValue={changeValue}
                scrollTo={scrollTo}
            />
        ));

    return (
        <Dialog open={open} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogContent sx={{ padding: 0, width: '1100px' }}>
                <FilterComponent
                    p={polyglot}
                    loaders={loaders}
                    filter={filteredLoaders}
                    setFilter={setFilter}
                />
                <List sx={{ height: '70vh' }}>
                    <ListItemComponent
                        key={'automatic'}
                        value={'automatic'}
                        title={polyglot.t('automatic-loader')}
                        selected={value === 'automatic'}
                        comment={polyglot.t('automatic-loader-comment')}
                        changeValue={changeValue}
                        scrollTo={scrollTo}
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
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    actions: PropTypes.node,
};

const ListItemComponent = ({
    value,
    title,
    comment,
    selected,
    changeValue,
    scrollTo,
}) => {
    return (
        <ListItem
            value={value}
            onClick={() => changeValue(value)}
            sx={{
                ...styles.item,
                ...(selected ? styles.selectedItem : {}),
            }}
            ref={selected ? scrollTo : null}
        >
            <ListItemText
                primary={title}
                primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
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
    changeValue: PropTypes.func.isRequired,
    scrollTo: PropTypes.func.isRequired,
};

const FilterComponent = ({ loaders, filter, setFilter, p: polyglot }) => {
    const allFilters = {
        allFormat: loaders.map((l) => l.name),
        csvFormat: loaders
            .filter((l) => l.name.startsWith('csv'))
            .map((l) => l.name),
        tsvFormat: loaders
            .filter((l) => l.name.startsWith('tsv'))
            .map((l) => l.name),
        xmlFormat: loaders
            .filter((l) =>
                [
                    'xml',
                    'rss',
                    'atom',
                    'mods',
                    'tei',
                    'tei-persee',
                    'skos',
                ].includes(l.name),
            )
            .map((l) => l.name),
        jsonFormat: loaders
            .filter((l) => l.name.startsWith('json'))
            .map((l) => l.name),
    };
    allFilters.otherFormat = allFilters.allFormat.filter(
        (l) =>
            !allFilters.csvFormat.includes(l) &&
            !allFilters.tsvFormat.includes(l) &&
            !allFilters.xmlFormat.includes(l) &&
            !allFilters.jsonFormat.includes(l),
    );

    return (
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
            spacing={2}
        >
            <Box>
                <FilterIcon fontSize="large" sx={{ marginRight: '10px' }} />
            </Box>
            {Object.keys(allFilters).map((key) => (
                <Box key={key}>
                    <Button
                        variant={
                            allFilters[key].toString() === filter.toString()
                                ? 'contained'
                                : 'outlined'
                        }
                        color="primary"
                        onClick={() => setFilter(allFilters[key])}
                        className="format-category"
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
