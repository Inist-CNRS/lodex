import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fromFields } from '../../sharedSelectors';
import { loadField } from '../../fields';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { Box } from '@mui/system';
import {
    Autocomplete,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    TextField,
} from '@mui/material';
import FieldInternalIcon from '../../fields/FieldInternalIcon';
import { Typography } from '@material-ui/core';

const AutocompleteSearch = ({ fields, onChange, value, translation }) => {
    return (
        <Autocomplete
            labelId="autocomplete_search_in_fields"
            data-testid="autocomplete_search_in_fields"
            fullWidth
            options={fields}
            value={value}
            multiple
            renderInput={params => (
                <TextField
                    {...params}
                    label={translation}
                    placeholder={translation}
                />
            )}
            renderOption={(props, option) =>
                !!option.label && (
                    <MenuItem
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            {option.label} ({option.name})
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {option.internalScopes &&
                                option.internalScopes.map(internalScope => (
                                    <FieldInternalIcon
                                        key={internalScope}
                                        scope={internalScope}
                                    />
                                ))}
                            {option.internalName}
                        </Box>
                    </MenuItem>
                )
            }
            onChange={onChange}
        />
    );
};

export const SearchForm = ({ fields, loadField, p: polyglot }) => {
    const [searchInFields, setSearchInFields] = React.useState([]);
    const [facetChecked, setFacetChecked] = React.useState([]);
    const [resourceTitle, setResourceTitle] = React.useState([]);
    const [resourceDescription, setResourceDescription] = React.useState([]);
    const [resourceDetailFirst, setResourceDetailFirst] = React.useState([]);
    const [resourceDetailSecond, setResourceDetailSecond] = React.useState([]);

    useEffect(() => {
        loadField();
    }, []);

    const handleSearchInFieldsChange = (event, value) => {
        setSearchInFields(value);
    };
    const handleSResourceTitle = (event, value) => {
        setResourceTitle(value);
    };
    const handleSResourceDescription = (event, value) => {
        setResourceDescription(value);
    };
    const handleSResourceDetailFirst = (event, value) => {
        setResourceDetailFirst(value);
    };
    const handleSResourceDetailSecond = (event, value) => {
        setResourceDetailSecond(value);
    };

    const handleFacetCheckedChange = value => {
        const currentIndex = facetChecked.findIndex(
            item => item.name === value.name,
        );
        const newChecked = [...facetChecked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setFacetChecked(newChecked);
    };
    return (
        <Box>
            <Box display="flex" flexDirection="column" mb={5}>
                <Typography variant="caption" sx={{ margin: 'auto' }}>
                    Search input
                </Typography>
                <Box sx={{ border: '1px dashed', padding: 2 }}>
                    <AutocompleteSearch
                        translation={polyglot.t('search_in_fields')}
                        fields={fields}
                        onChange={handleSearchInFieldsChange}
                        value={searchInFields}
                    />
                </Box>
            </Box>

            <Box display="flex" gap={10}>
                <Box display="flex" flex={1} flexDirection="column">
                    <Typography variant="caption" sx={{ margin: 'auto' }}>
                        Facet
                    </Typography>
                    <Box sx={{ border: '1px dashed' }}>
                        <List
                            sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                maxHeight: 400,
                                overflow: 'auto',
                                padding: 2,
                            }}
                        >
                            {fields.map(field => {
                                const labelId = `checkbox-list-label-${field.name}`;

                                return (
                                    <ListItem key={field.name} disablePadding>
                                        <ListItemButton
                                            onClick={() =>
                                                handleFacetCheckedChange(field)
                                            }
                                            dense
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={
                                                        facetChecked.findIndex(
                                                            item =>
                                                                item.name ===
                                                                field.name,
                                                        ) !== -1
                                                    }
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                id={labelId}
                                                primary={`(${field.name}) ${field.label}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Box>

                <Box display="flex" flex={1} flexDirection="column">
                    <Typography variant="caption" sx={{ margin: 'auto' }}>
                        Resource result
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={5}
                        sx={{ border: '1px dashed', padding: 2 }}
                    >
                        <AutocompleteSearch
                            translation={polyglot.t('resource_title')}
                            fields={fields}
                            onChange={handleSResourceTitle}
                            value={resourceTitle}
                        />
                        <AutocompleteSearch
                            translation={polyglot.t('resource_description')}
                            fields={fields}
                            onChange={handleSResourceDescription}
                            value={resourceDescription}
                        />
                        <Box display="flex" gap={2}>
                            <AutocompleteSearch
                                translation={polyglot.t(
                                    'resource_detail_first',
                                )}
                                fields={fields}
                                onChange={handleSResourceDetailFirst}
                                value={resourceDetailFirst}
                            />
                            <AutocompleteSearch
                                translation={polyglot.t(
                                    'resource_detail_second',
                                )}
                                fields={fields}
                                onChange={handleSResourceDetailSecond}
                                value={resourceDetailSecond}
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

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(SearchForm);
