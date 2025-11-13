import React, { useState, useEffect } from 'react';
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
import CancelButton from '../components/CancelButton';
import { useTranslate } from '../i18n/I18NContext';

interface FormatCatalogDescriptionProps {
    format: {
        description: string;
        docUrl?: string;
    };
}

const FormatCatalogDescription = ({
    format,
}: FormatCatalogDescriptionProps) => {
    const { translate } = useTranslate();
    return (
        <React.Fragment>
            <Typography>{translate(`${format.description}`)}</Typography>
            <Box justifyContent="flex-end" display="flex" mt={2}>
                {format.docUrl && (
                    <Tooltip title={translate(`tooltip_documentation`)}>
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

export type FormatProps = {
    name: string;
    componentName: string;
    type: string;
    description: string;
    docUrl?: string;
};

interface FormatCatalogProps {
    formats: FormatProps[];
    isOpen: boolean;
    handleClose(...args: unknown[]): unknown;
    onChange(...args: unknown[]): unknown;
    currentValue?: string;
}

export const FormatCatalog = ({
    formats,
    isOpen,
    handleClose,
    onChange,
    currentValue,
}: FormatCatalogProps) => {
    const { translate } = useTranslate();
    const filters = [...new Set(formats.map((item) => item.type))].sort(
        (x, y) => translate(x).localeCompare(translate(y)),
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

    // @ts-expect-error TS7006
    const handleValueChange = (newValue) => {
        onChange(newValue);
        handleClose();
    };

    // @ts-expect-error TS7006
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
                                {translate(filter)}
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
                                        {translate(format.name)}
                                    </Typography>
                                }
                                secondary={
                                    <FormatCatalogDescription format={format} />
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <CancelButton variant="text" onClick={handleClose}>
                    {translate('cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

export default FormatCatalog;
