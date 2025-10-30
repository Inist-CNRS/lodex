import React, { useEffect, useState } from 'react';
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
import FilterIcon from '@mui/icons-material/FilterList';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GitHubIcon from '@mui/icons-material/GitHub';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import CancelButton from '@lodex/frontend-common/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

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
        '& a': {
            color: 'var(--contrast-main)',
        },
    },
};

interface EnricherDescriptionProps {
    enricher: {
        id: string;
        doc?: string;
        swagger?: string;
        objectifTDM?: string;
        code?: string;
    };
    translatePrefix: string;
}

const EnricherDescription = ({
    enricher,
    translatePrefix,
}: EnricherDescriptionProps) => {
    const { translate } = useTranslate();
    return (
        <React.Fragment>
            <Typography>
                {translate(`${translatePrefix}_${enricher.id}_description`)}
            </Typography>
            <Box justifyContent="flex-end" display="flex">
                {enricher.code && (
                    <Tooltip title={translate(`tooltip_documentation`)}>
                        <Link
                            href={enricher.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: '1em' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GitHubIcon />
                        </Link>
                    </Tooltip>
                )}
                {enricher.objectifTDM && (
                    <Tooltip title={translate(`tooltip_objectifTDM`)}>
                        <Link
                            href={enricher.objectifTDM}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: '1em' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MenuBookIcon />
                        </Link>
                    </Tooltip>
                )}
                {enricher.swagger && (
                    <Tooltip title={translate(`tooltip_swagger`)}>
                        <Link
                            href={enricher.swagger}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SettingsEthernetIcon />
                        </Link>
                    </Tooltip>
                )}
            </Box>
        </React.Fragment>
    );
};

interface EnrichmentCatalogProps {
    isOpen: boolean;
    handleClose(...args: unknown[]): unknown;
    onChange(...args: unknown[]): unknown;
    selectedWebServiceUrl?: string;
    enrichers: {
        id: string;
        type: string;
        url: string;
        doc?: string;
        swagger?: string;
        objectifTDM?: string;
        code?: string;
    }[];
    translatePrefix: string;
}

export const EnrichmentCatalog = ({
    isOpen,

    handleClose,

    onChange,

    selectedWebServiceUrl,

    enrichers,

    translatePrefix,
}: EnrichmentCatalogProps) => {
    const { translate } = useTranslate();
    const filters = (
        [
            ...new Set(
                enrichers.map((item: { type: string }): string => item.type),
            ),
        ] as string[]
    ).sort((x: string, y: string) => x.localeCompare(y));
    filters.unshift('all');
    filters.push(filters.splice(filters.indexOf('other'), 1)[0]);

    const [filteredEnricher, setFilterEnricher] = useState(enrichers);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        setFilterEnricher(
            selectedFilter && selectedFilter !== 'all'
                ? enrichers.filter((item) => item.type === selectedFilter)
                : enrichers,
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
                    {filteredEnricher.map((enricher) => (
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
                                        {translate(
                                            `${translatePrefix}_${enricher.id}_title`,
                                        )}
                                    </Typography>
                                }
                                secondary={
                                    <EnricherDescription
                                        enricher={enricher}
                                        translatePrefix={translatePrefix}
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

export default EnrichmentCatalog;
