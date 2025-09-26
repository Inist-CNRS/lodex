import PropTypes from 'prop-types';
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
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';

import * as overview from '../../../../common/overview';
import { getFieldForSpecificScope } from '../../../../common/scope';
import { toast } from '../../../../common/tools/toast';
import FieldRepresentation from '../../fields/FieldRepresentation';
import { translate } from '../../i18n/I18NContext';
import withInitialData from '../withInitialData';
import { usePatchFieldOverview } from './usePatchFieldOverview';
import { usePatchSortField } from './usePatchSortField';
import { usePatchSortOrder } from './usePatchSortOrder';

const getSearchableFields = (fields) =>
    fields.filter((f) => f.searchable) || [];

const getFacetFields = (fields) => fields?.filter((f) => f.isFacet) || [];

const getResourceTitle = (fields) =>
    fields?.find((f) => f.overview === overview.RESOURCE_TITLE) || null;
const getResourceDescription = (fields) =>
    fields?.find((f) => f.overview === overview.RESOURCE_DESCRIPTION) || null;
const getResourceDetailFirst = (fields) =>
    fields?.find((f) => f.overview === overview.RESOURCE_DETAIL_1) || null;
const getResourceDetailSecond = (fields) =>
    fields?.find((f) => f.overview === overview.RESOURCE_DETAIL_2) || null;
const getResourceDetailThird = (fields) =>
    fields?.find((f) => f.overview === overview.RESOURCE_DETAIL_3) || null;
const getResourceSortField = (fields) =>
    fields?.find((f) => f.isDefaultSortField) || null;
const getResourceSortOrder = (fields) =>
    getResourceSortField(fields)?.sortOrder || 'asc';

export const SearchForm = ({ fields, loadField, p: polyglot }) => {
    const fieldsResource = React.useMemo(
        () => getFieldForSpecificScope(fields, 'collection'),
        [fields],
    );

    const fieldsForResourceSyndication = React.useMemo(() => {
        const filteredFields = getFieldForSpecificScope(fields, 'collection');
        filteredFields?.unshift({
            label: polyglot.t('none'),
        });
        return filteredFields;
    }, [polyglot, fields]);

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

    const handleSearchInFieldsChange = async (event, value) => {
        setSearchInFields(value);
        const res = await fieldApi.patchSearchableFields(value);
        if (!res) {
            toast(polyglot.t('searchable_error'), {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const patchFieldOverviewMutation = usePatchFieldOverview();
    const patchSortFieldMutation = usePatchSortField();
    const patchSortOrderMutation = usePatchSortOrder();

    const handleSResourceTitle = async (_event, value) => {
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_TITLE,
        });
    };
    const handleSResourceDescription = async (_event, value) => {
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DESCRIPTION,
        });
    };

    const handleSResourceDetailFirst = async (_event, value) => {
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DETAIL_1,
        });
    };

    const handleSResourceDetailSecond = async (_event, value) => {
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DETAIL_2,
        });
    };
    const handleSResourceDetailThird = async (_event, value) => {
        patchFieldOverviewMutation.mutate({
            _id: value?._id,
            overview: overview.RESOURCE_DETAIL_3,
        });
    };

    const [isPending, setIsPending] = React.useState(false);

    useEffect(() => {
        let timer;
        const loading =
            patchFieldOverviewMutation.isLoading ||
            patchSortFieldMutation.isLoading ||
            patchSortOrderMutation.isLoading;

        if (loading) {
            timer = setTimeout(() => setIsPending(true), 100);
        } else {
            setIsPending(false);
        }

        return () => clearTimeout(timer);
    }, [
        patchFieldOverviewMutation.isLoading,
        patchSortFieldMutation.isLoading,
        patchSortOrderMutation.isLoading,
    ]);

    const handleResourceSortFieldChange = async (_event, value) => {
        patchSortFieldMutation.mutate({
            _id: value?._id,
            sortOrder: resourceSortOrder,
        });
    };

    const handleResourceSortOrderChange = async (event) => {
        setResourceSortOrder(event.target.value);
        patchSortOrderMutation.mutate({
            sortOrder: event.target.value,
        });
    };

    const handleFacetCheckedChange = async (value) => {
        const currentIndex = facetChecked.findIndex(
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
            toast(polyglot.t('facet_error'), {
                type: toast.TYPE.ERROR,
            });
            setFacetChecked(oldChecked);
        }
    };

    return (
        <Box>
            <Box display="flex" flexDirection="column" mb={5}>
                <Typography variant="caption">
                    {polyglot.t('search_input')}
                </Typography>
                <Box sx={{ border: '1px dashed', padding: 2 }}>
                    <SearchAutocomplete
                        testId="autocomplete_search_in_fields"
                        translation={polyglot.t('search_in_fields')}
                        fields={fieldsResource}
                        onChange={handleSearchInFieldsChange}
                        value={searchInFields}
                        multiple
                        clearText={polyglot.t('clear')}
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
                        {polyglot.t('facets')}
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
                        {polyglot.t('search_syndication')}
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
                            translation={polyglot.t('resource_title')}
                            fields={fieldsForResourceSyndication}
                            onChange={handleSResourceTitle}
                            value={resourceTitle}
                            clearText={polyglot.t('clear')}
                            isLoading={isPending}
                        />
                        <SearchAutocomplete
                            testId={`autocomplete_search_syndication_${overview.RESOURCE_DESCRIPTION}`}
                            translation={polyglot.t('resource_description')}
                            fields={fieldsForResourceSyndication}
                            onChange={handleSResourceDescription}
                            value={resourceDescription}
                            clearText={polyglot.t('clear')}
                            isLoading={isPending}
                        />
                        <Box display="flex" gap={2}>
                            <SearchAutocomplete
                                testId={`autocomplete_search_syndication_${overview.RESOURCE_DETAIL_1}`}
                                translation={polyglot.t(
                                    'resource_detail_first',
                                )}
                                fields={fieldsForResourceSyndication}
                                onChange={handleSResourceDetailFirst}
                                value={resourceDetailFirst}
                                clearText={polyglot.t('clear')}
                                isLoading={isPending}
                            />
                            <SearchAutocomplete
                                testId={`autocomplete_search_syndication_${overview.RESOURCE_DETAIL_2}`}
                                translation={polyglot.t(
                                    'resource_detail_second',
                                )}
                                fields={fieldsForResourceSyndication}
                                onChange={handleSResourceDetailSecond}
                                value={resourceDetailSecond}
                                clearText={polyglot.t('clear')}
                                isLoading={isPending}
                            />
                            <SearchAutocomplete
                                testId={`autocomplete_search_syndication_${overview.RESOURCE_DETAIL_3}`}
                                translation={polyglot.t(
                                    'resource_detail_third',
                                )}
                                fields={fieldsForResourceSyndication}
                                onChange={handleSResourceDetailThird}
                                value={resourceDetailThird}
                                clearText={polyglot.t('clear')}
                                isLoading={isPending}
                            />
                        </Box>

                        <Box display="flex" gap={2}>
                            <SearchAutocomplete
                                testId={`autocomplete_resource_sort_field`}
                                translation={polyglot.t('resource_sort_field')}
                                fields={sortableFields}
                                onChange={handleResourceSortFieldChange}
                                value={resourceSortField}
                                clearText={polyglot.t('clear')}
                                isLoading={isPending}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="sort-order-label">
                                    {polyglot.t('resource_sort_order')}
                                </InputLabel>
                                <Select
                                    labelId="sort-order-label"
                                    value={resourceSortOrder}
                                    label={polyglot.t('resource_sort_order')}
                                    onChange={handleResourceSortOrderChange}
                                    disabled={isPending}
                                >
                                    <MenuItem value="asc">
                                        {polyglot.t('asc')}
                                    </MenuItem>
                                    <MenuItem value="desc">
                                        {polyglot.t('desc')}
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

SearchForm.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    loadField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

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
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(SearchForm);
