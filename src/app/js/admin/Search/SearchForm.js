import React, { useEffect } from 'react';
import fieldApi from '../../admin/api/field';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import SearchAutocomplete from './SearchAutocomplete';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fromFields } from '../../sharedSelectors';
import { loadField } from '../../fields';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box } from '@mui/system';
import {
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';

import * as overview from '../../../../common/overview';
import { toast } from '../../../../common/tools/toast';
import { getFieldForSpecificScope } from '../../../../common/scope';
import FieldRepresentation from '../../fields/FieldRepresentation';
import withInitialData from '../withInitialData';

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
    }, [fields]);

    const [searchInFields, setSearchInFields] = React.useState(
        getSearchableFields(fieldsResource),
    );

    const [facetChecked, setFacetChecked] = React.useState(
        getFacetFields(fieldsResource),
    );

    const [resourceTitle, setResourceTitle] = React.useState(
        getResourceTitle(fieldsForResourceSyndication),
    );
    const [resourceDescription, setResourceDescription] = React.useState(
        getResourceDescription(fieldsForResourceSyndication),
    );
    const [resourceDetailFirst, setResourceDetailFirst] = React.useState(
        getResourceDetailFirst(fieldsForResourceSyndication),
    );
    const [resourceDetailSecond, setResourceDetailSecond] = React.useState(
        getResourceDetailSecond(fieldsForResourceSyndication),
    );
    const [resourceDetailThird, setResourceDetailThird] = React.useState(
        getResourceDetailThird(fieldsForResourceSyndication),
    );

    useEffect(() => {
        loadField();
    }, []);

    useEffect(() => {
        setFacetChecked(getFacetFields(fieldsResource));
        setSearchInFields(getSearchableFields(fieldsResource));
        setResourceTitle(getResourceTitle(fieldsForResourceSyndication));
        setResourceDescription(
            getResourceDescription(fieldsForResourceSyndication),
        );
        setResourceDetailFirst(
            getResourceDetailFirst(fieldsForResourceSyndication),
        );
        setResourceDetailSecond(
            getResourceDetailSecond(fieldsForResourceSyndication),
        );
        setResourceDetailThird(
            getResourceDetailThird(fieldsForResourceSyndication),
        );
    }, [fieldsResource]);

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

    const saveSyndication = async (value, overview) => {
        const res = await fieldApi.patchOverview({
            _id: value?._id,
            overview,
        });
        if (!res) {
            toast(polyglot.t('syndication_error'), {
                type: toast.TYPE.ERROR,
            });
        }
    };

    const handleSResourceTitle = async (event, value) => {
        saveSyndication(value, overview.RESOURCE_TITLE);
    };
    const handleSResourceDescription = async (event, value) => {
        saveSyndication(value, overview.RESOURCE_DESCRIPTION);
    };
    const handleSResourceDetailFirst = async (event, value) => {
        saveSyndication(value, overview.RESOURCE_DETAIL_1);
    };
    const handleSResourceDetailSecond = async (event, value) => {
        saveSyndication(value, overview.RESOURCE_DETAIL_2);
    };
    const handleSResourceDetailThird = async (event, value) => {
        saveSyndication(value, overview.RESOURCE_DETAIL_3);
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
                        />
                        <SearchAutocomplete
                            testId={`autocomplete_search_syndication_${overview.RESOURCE_DESCRIPTION}`}
                            translation={polyglot.t('resource_description')}
                            fields={fieldsForResourceSyndication}
                            onChange={handleSResourceDescription}
                            value={resourceDescription}
                            clearText={polyglot.t('clear')}
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
                            />
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
