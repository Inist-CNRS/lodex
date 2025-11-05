import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useController, useFormContext } from 'react-hook-form';
import { FilterAlt } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HomeIcon from '@mui/icons-material/Home';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

export const FieldToggleInternalScopeComponent = ({
    name,
}: {
    name: string;
}) => {
    const { translate } = useTranslate();
    const matches = useRouteMatch<{
        fieldName: string;
        filter: string;
        subresourceId?: string;
    }>();

    const { control } = useFormContext();
    const { field } = useController({
        name,
        control,
    });

    useEffect(() => {
        if (
            !field ||
            Array.isArray(field?.value) ||
            matches.params.fieldName !== 'new' ||
            field.value?.length > 0
        ) {
            return;
        }

        if (matches.params.filter === 'dataset') {
            field.onChange(['home']);
            return;
        }

        if (matches.params.subresourceId) {
            field.onChange(['subRessource']);
            return;
        }

        if (matches.params.filter === 'document') {
            field.onChange(['document']);
            return;
        }

        if (matches.params.filter === 'graphic') {
            field.onChange(['chart']);
            return;
        }
    }, [field, matches]);

    return (
        <ToggleButtonGroup
            value={field.value ?? []}
            onChange={(_, newValues) => field.onChange(newValues)}
            aria-label="text alignment"
            color="primary"
        >
            <ToggleButton value="home" aria-label="left aligned">
                <Tooltip title={translate('home_tooltip')}>
                    <HomeIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="document" aria-label="centered">
                <Tooltip title={translate('document_tooltip')}>
                    <ArticleIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="subRessource" aria-label="centered">
                <Tooltip title={translate('subRessource_tooltip')}>
                    <DocumentScannerIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="facet" aria-label="centered">
                <Tooltip title={translate('facet_tooltip')}>
                    <FilterAlt />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value="chart" aria-label="right aligned">
                <Tooltip title={translate('chart_tooltip')}>
                    <EqualizerIcon />
                </Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default FieldToggleInternalScopeComponent;
