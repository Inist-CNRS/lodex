import { useState, useEffect, type ReactNode, type Ref } from 'react';
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

import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

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

type ListItemComponentProps = {
    selected: boolean;
    comment: string;
    title: string;
    value: string;
    changeValue: (value: string) => void;
};

const ListItemComponent = ({
    value,
    title,
    comment,
    selected,
    changeValue,
}: ListItemComponentProps) => {
    const scrollTo: Ref<HTMLLIElement> = (el) => {
        if (el) {
            el.scrollIntoView({ inline: 'center', block: 'center' });
        }
    };
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

type FilterComponentProps = {
    filter: string[];
    setFilter: (value: string[]) => void;
    loaders?: Loader[];
};

type FormatCategory =
    | 'allFormat'
    | 'csvFormat'
    | 'tsvFormat'
    | 'xmlFormat'
    | 'jsonFormat'
    | 'otherFormat';

const FilterComponent = ({
    loaders = [],
    filter,
    setFilter,
}: FilterComponentProps) => {
    const { translate } = useTranslate();

    const allFormat = loaders.map((l) => l.name);

    const csvFormat = allFormat.filter((name) => name.startsWith('csv'));
    const tsvFormat = allFormat.filter((name) => name.startsWith('tsv'));
    const xmlFormat = allFormat.filter((name) =>
        ['xml', 'rss', 'atom', 'mods', 'tei', 'tei-persee', 'skos'].includes(
            name,
        ),
    );
    const jsonFormat = allFormat.filter((name) => name.startsWith('json'));
    const otherFormat = allFormat.filter(
        (l) =>
            !csvFormat.includes(l) &&
            !tsvFormat.includes(l) &&
            !xmlFormat.includes(l) &&
            !jsonFormat.includes(l),
    );

    const allFilters: Record<FormatCategory, string[]> = {
        allFormat,
        csvFormat,
        tsvFormat,
        xmlFormat,
        jsonFormat,
        otherFormat,
    };

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
                            allFilters[key as FormatCategory].toString() ===
                            filter.toString()
                                ? 'contained'
                                : 'outlined'
                        }
                        color="primary"
                        onClick={() =>
                            setFilter(allFilters[key as FormatCategory])
                        }
                        className="format-category"
                    >
                        {translate(key)}
                    </Button>
                </Box>
            ))}
        </Grid>
    );
};

export type Loader = {
    name: string;
};

type ListDialogComponentProps = {
    loaders: Loader[];
    value: string;
    setLoader: (loader: string) => void;
    open: boolean;
    handleClose: () => void;
    actions: ReactNode;
};

export const ListDialogComponent = ({
    loaders,
    value,
    setLoader,
    open,
    handleClose,
    actions,
}: ListDialogComponentProps) => {
    const { translate } = useTranslate();
    const [filteredLoaders, setFilter] = useState(loaders.map((l) => l.name));

    useEffect(() => {
        setFilter(loaders.map((l) => l.name));
    }, [loaders]);

    const changeValue = (newValue: string) => {
        setLoader(newValue);
        handleClose();
    };

    const loaderNames = loaders
        .map((loader) => loader.name)
        .filter((loader) => filteredLoaders.includes(loader))
        .sort((x, y) => translate(x).localeCompare(translate(y)))
        .map((pn) => (
            <ListItemComponent
                key={pn}
                value={pn}
                title={translate(pn)}
                comment={translate(`${pn}-comment`)}
                selected={value === pn}
                changeValue={changeValue}
            />
        ));

    return (
        <Dialog open={open} onClose={handleClose} scroll="body" maxWidth="xl">
            <DialogContent sx={{ padding: 0, width: '1100px' }}>
                <FilterComponent
                    loaders={loaders}
                    filter={filteredLoaders}
                    setFilter={setFilter}
                />
                <List sx={{ height: '70vh' }}>
                    <ListItemComponent
                        key={'automatic'}
                        value={'automatic'}
                        title={translate('automatic-loader')}
                        selected={value === 'automatic'}
                        comment={translate('automatic-loader-comment')}
                        changeValue={changeValue}
                    />
                    {loaderNames}
                </List>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

export default ListDialogComponent;
