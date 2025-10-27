import React, { useEffect, useMemo } from 'react';
import fieldApi from '../../admin/api/field';
import SearchAutocomplete from './SearchAutocomplete';

import {
    Checkbox,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { loadField } from '../../fields';
import { fromFields } from '../../sharedSelectors';

import * as overview from '../../../../common/overview';
import { getFieldForSpecificScope } from '../../../../common/scope';
import { toast } from '../../../../common/tools/toast';
import FieldRepresentation from '../../fields/FieldRepresentation';
import withInitialData from '../withInitialData';
import { usePatchFieldOverview } from './usePatchFieldOverview';
import { usePatchSortField } from './usePatchSortField';
import { usePatchSortOrder } from './usePatchSortOrder';
import { useTranslate } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const getSearchableFields = (fields) =>
    // @ts-expect-error TS7006
    fields.filter((f) => f.searchable) || [];

// @ts-expect-error TS7006
const getFacetFields = (fields) => fields?.filter((f) => f.isFacet) || [];

// @ts-expect-error TS7006
const getResourceTitle = (fields) =>
    // @ts-expect-error TS7006
    fields?.find((f) => f.overview === overview.RESOURCE_TITLE) || null;
// @ts-expect-error TS7006
const getResourceDescription = (fields) =>
    // @ts-expect-error TS7006
    fields?.find((f) => f.overview === overview.RESOURCE_DESCRIPTION) || null;
// @ts-expect-error TS7006
const getResourceDetailFirst = (fields) =>
    // @ts-expect-error TS7006
    fields?.find((f) => f.overview === overview.RESOURCE_DETAIL_1) || null;
// @ts-expect-error TS7006
const getResourceDetailSecond = (fields) =>
    // @ts-expect-error TS7006
    fields?.find((f) => f.overview === overview.RESOURCE_DETAIL_2) || null;
// @ts-expect-error TS7006
const getResourceDetailThird = (fields) =>
    // @ts-expect-error TS7006
    fields?.find((f) => f.overview === overview.RESOURCE_DETAIL_3) || null;
// @ts-expect-error TS7006
const getResourceSortField = (fields) =>
    // @ts-expect-error TS7006
    fields?.find((f) => f.isDefaultSortField) || null;
// @ts-expect-error TS7006
const getResourceSortOrder = (fields) =>
    getResourceSortField(fields)?.sortOrder || 'asc';

export type SearchFormProps = {
    fields: object[];
    loadField(...args: unknown[]): unknown;
};

export const SearchForm = ({ fields, loadField }: SearchFormProps) => {
    const { translate } = useTranslate();
    const fieldsResource = React.useMemo(
        () => getFieldForSpecificScope(fields, 'collection'),
        [fields],
    );

    const fieldsForResourceSyndication = React.useMemo(() => {
        const filteredFields = getFieldForSpecificScope(fields, 'collection');
        filteredFields?.unshift({
            label: translate('none'),
        });
        return filteredFields;
    }, [translate, fields]);

    const [searchInFields, setSearchInFields] = React.useState(
        getSearchableFields(fieldsResource),
    );

    const [facetChecked, setFacetChecked] = React.useState(
        getFacetFields(fieldsResource),
    );

    const {
        resourceTitle,
        resourceDescription,
        resourceDetailFirst,
        resourceDetailSecond,
        resourceDetailThird,
        resourceSortField,
        resourceSortOrder: initialResourceSortOrder,
        sortableFields,
    } = useMemo(() => {
        const resourceTitle = getResourceTitle(fieldsForResourceSyndication);
        const resourceDescription = getResourceDescription(
            fieldsForResourceSyndication,
        );
        const resourceDetailFirst = getResourceDetailFirst(
            fieldsForResourceSyndication,
        );
        const resourceDetailSecond = getResourceDetailSecond(
            fieldsForResourceSyndication,
        );
        const resourceDetailThird = getResourceDetailThird(
            fieldsForResourceSyndication,
        );

        const sortableFields = [
            resourceTitle,
            resourceDescription,
            resourceDetailFirst,
            resourceDetailSecond,
            resourceDetailThird,
        ].filter((field) => field);

        return {
            resourceTitle,
            resourceDescription,
            resourceDetailFirst,
            resourceDetailSecond,
            resourceDetailThird,
            resourceSortField: getResourceSortField(sortableFields),
            resourceSortOrder: getResourceSortOrder(sortableFields),
            sortableFields,
        };
    }, [fieldsForResourceSyndication]);

    const [resourceSortOrder, setResourceSortOrder] = React.useState(
        initialResourceSortOrder,
    );

    useEffect(() => {
        loadField();
    }, [loadField]);

    useEffect(() => {
        setFacetChecked(getFacetFields(fieldsResource));
        setSearchInFields(getSearchableFields(fieldsResource));
    }, [fieldsResource, setSearchInFields, setFacetChecked]);

    useEffect(() => {
        setResourceSortOrder(initialResourceSortOrder);
    }, [initialResourceSortOrder, setResourceSortOrder]);

    // We could lower the complexity with only one map. But it's more readable like this. And the performance is not a problem here.

    // @ts-expect-error TS7006
    const handleSearchInFieldsChange = async (event, value) => {
        setSearchInFields(value);
        const res = await fieldApi.patchSearchableFields(value);
        if (!res) {
            toast(translate('searchable_error'), {
                type: 'error',
            });
        }
    };

    const patchFieldOverviewMutation = usePatchFieldOverview();
    const patchSortFieldMutation = usePatchSortField();
    const patchSortOrderMutation = usePatchSortOrder();

    // @ts-expect-error TS7006
    const handleSResourceTitle = async (_event, value) => {
        // @ts-expect-error TS2345
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_TITLE,
        });
    };
    // @ts-expect-error TS7006
    const handleSResourceDescription = async (_event, value) => {
        // @ts-expect-error TS2345
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DESCRIPTION,
        });
    };

    // @ts-expect-error TS7006
    const handleSResourceDetailFirst = async (_event, value) => {
        // @ts-expect-error TS2345
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DETAIL_1,
        });
    };

    // @ts-expect-error TS7006
    const handleSResourceDetailSecond = async (_event, value) => {
        // @ts-expect-error TS2345
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DETAIL_2,
        });
    };
    // @ts-expect-error TS7006
    const handleSResourceDetailThird = async (_event, value) => {
        // @ts-expect-error TS2345
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DETAIL_3,
        });
    };

    const [isPending, setIsPending] = React.useState(false);

    useEffect(() => {
        let timer: number;
        const loading =
            patchFieldOverviewMutation.isLoading ||
            patchSortFieldMutation.isLoading ||
            patchSortOrderMutation.isLoading;

        if (loading) {
            timer = setTimeout(
                () => setIsPending(true),
                100,
            ) as unknown as number;
        } else {
            setIsPending(false);
        }

        return () => clearTimeout(timer);
    }, [
        patchFieldOverviewMutation.isLoading,
        patchSortFieldMutation.isLoading,
        patchSortOrderMutation.isLoading,
    ]);

    // @ts-expect-error TS7006
    const handleResourceSortFieldChange = async (_event, value) => {
        // @ts-expect-error TS2345
        patchSortFieldMutation.mutate({
            _id: value?._id,
            sortOrder: resourceSortOrder,
        });
    };

    // @ts-expect-error TS7006
    const handleResourceSortOrderChange = async (event) => {
        setResourceSortOrder(event.target.value);
        // @ts-expect-error TS2345
        patchSortOrderMutation.mutate({
            sortOrder: event.target.value,
        });
    };

    // @ts-expect-error TS7006
    const handleFacetCheckedChange = async (value) => {
        const currentIndex = facetChecked.findIndex(
            // @ts-expect-error TS7006
            (item) => item.name === value.name,
        );
        const oldChecked = [...facetChecked];
        const newChecked = [...facetChecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setFacetChecked(newChecked);

        const { _id } = value;
        const res = await fieldApi.patchField({
            _id,
            isFacet: currentIndex === -1,
        });
        if (!res) {
            toast(translate('facet_error'), {
                type: 'error',
            });
            setFacetChecked(oldChecked);
        }
    };

    return (
        <Box>
            <Box display="flex" flexDirection="column" mb={5}>
                <Typography variant="caption">
                    {translate('search_input')}
                </Typography>
                <Box sx={{ border: '1px dashed', padding: 2 }}>
                    <SearchAutocomplete
                        testId="autocomplete_search_in_fields"
                        translation={translate('search_in_fields')}
                        fields={fieldsResource}
                        onChange={handleSearchInFieldsChange}
                        value={searchInFields}
                        multiple
                        clearText={translate('clear')}
                    />
                </Box>
            </Box>

            <Box display="flex" alignItems={'stretch'} gap={5}>
                <Box
                    display="flex"
                    flex={3}
                    flexDirection="column"
                    overflow="auto"
                >
                    <Typography variant="caption">
                        {translate('facets')}
                    </Typography>
                    <Box sx={{ border: '1px dashed' }}>
                        <List
                            sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                maxHeight: 300,
                                overflow: 'auto',
                                padding: 0,
                            }}
                        >
                            {/*
                             // @ts-expect-error TS7006 */}
                            {fieldsResource?.map((field) => {
                                const labelId = `checkbox-list-label-${field.name}`;

                                return (
                                    <ListItem
                                        key={field.name}
                                        disablePadding
                                        dense
                                    >
                                        <ListItemButton
                                            onClick={() =>
                                                handleFacetCheckedChange(field)
                                            }
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: '30px',
                                                    padding: 0,
                                                }}
                                            >
                                                <Checkbox
                                                    edge="start"
                                                    checked={
                                                        facetChecked.findIndex(
                                                            // @ts-expect-error TS7006
                                                            (item) =>
                                                                item.name ===
                                                                field.name,
                                                        ) !== -1
                                                    }
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{
                                                        'aria-labelledby':
                                                            labelId,
                                                    }}
                                                    sx={{
                                                        padding: 0,
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                id={labelId}
                                                primary={
                                                    <FieldRepresentation
                                                        field={field}
                                                    />
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Box>

                <Box display="flex" flex={7} flexDirection="column">
                    <Typography variant="caption">
                        {translate('search_syndication')}
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent={'space-between'}
                        sx={{
                            border: '1px dashed',
                            padding: 2,
                            flexGrow: 1,
                            gap: 2,
                        }}
                    >
                        <SearchAutocomplete
                            testId={`autocomplete_search_syndication_${overview.RESOURCE_TITLE}`}
                            translation={translate('resource_title')}
                            fields={fieldsForResourceSyndication}
                            onChange={handleSResourceTitle}
                            value={resourceTitle}
                            clearText={translate('clear')}
                            isLoading={isPending}
                        />
                        <SearchAutocomplete
                            testId={`autocomplete_search_syndication_${overview.RESOURCE_DESCRIPTION}`}
                            translation={translate('resource_description')}
                            fields={fieldsForResourceSyndication}
                            onChange={handleSResourceDescription}
                            value={resourceDescription}
                            clearText={translate('clear')}
                            isLoading={isPending}
                        />
                        <Box display="flex" gap={2}>
                            <SearchAutocomplete
                                testId={`autocomplete_search_syndication_${overview.RESOURCE_DETAIL_1}`}
                                translation={translate('resource_detail_first')}
                                fields={fieldsForResourceSyndication}
                                onChange={handleSResourceDetailFirst}
                                value={resourceDetailFirst}
                                clearText={translate('clear')}
                                isLoading={isPending}
                            />
                            <SearchAutocomplete
                                testId={`autocomplete_search_syndication_${overview.RESOURCE_DETAIL_2}`}
                                translation={translate(
                                    'resource_detail_second',
                                )}
                                fields={fieldsForResourceSyndication}
                                onChange={handleSResourceDetailSecond}
                                value={resourceDetailSecond}
                                clearText={translate('clear')}
                                isLoading={isPending}
                            />
                            <SearchAutocomplete
                                testId={`autocomplete_search_syndication_${overview.RESOURCE_DETAIL_3}`}
                                translation={translate('resource_detail_third')}
                                fields={fieldsForResourceSyndication}
                                onChange={handleSResourceDetailThird}
                                value={resourceDetailThird}
                                clearText={translate('clear')}
                                isLoading={isPending}
                            />
                        </Box>

                        <Box display="flex" gap={2}>
                            <SearchAutocomplete
                                testId={`autocomplete_resource_sort_field`}
                                translation={translate('resource_sort_field')}
                                fields={sortableFields}
                                onChange={handleResourceSortFieldChange}
                                value={resourceSortField}
                                clearText={translate('clear')}
                                isLoading={isPending}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="sort-order-label">
                                    {translate('resource_sort_order')}
                                </InputLabel>
                                <Select
                                    labelId="sort-order-label"
                                    value={resourceSortOrder}
                                    label={translate('resource_sort_order')}
                                    onChange={handleResourceSortOrderChange}
                                    disabled={isPending}
                                >
                                    <MenuItem value="asc">
                                        {translate('asc')}
                                    </MenuItem>
                                    <MenuItem value="desc">
                                        {translate('desc')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        // sort by label asc
        fields: fromFields
            .getFields(state)
            .sort((a, b) => a.label.localeCompare(b.label)),
    };
};

const mapDispatchToProps = {
    loadField,
};

export default compose(
    withInitialData,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(SearchForm);
