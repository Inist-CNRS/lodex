import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchMyAnnotations } from './reducer';
import { fromSearch } from '../selectors';
import { useGetAnnotatedResourceUris } from '../../annotation/annotationStorage';

export const MyAnnotationsFilterComponent = ({ filters, onFilterChange }) => {
    const { translate } = useTranslate();

    const resourceUris = useGetAnnotatedResourceUris();
    const value = useMemo(() => {
        if (filters.resourceUris) {
            return 'my-annotations';
        }

        if (filters.excludedResourceUris) {
            return 'not-my-annotations';
        }

        return null;
    }, [filters]);

    return (
        <FormControl>
            <InputLabel htmlFor="my-annotations-filter">
                {translate('my_annotations_filter')}
            </InputLabel>
            <Select
                sx={{ width: 200 }}
                labelId="my-annotations-filter"
                label={translate('my-annotations-filter')}
                value={value}
                onChange={(e) =>
                    onFilterChange({ mode: e.target.value, resourceUris })
                }
            >
                <MenuItem value={null}>
                    {translate('my_annotations_filter_null_choice')}
                </MenuItem>
                <MenuItem value={'my-annotations'}>
                    {translate('my_annotations_filter_annotated_by_me_choice')}
                </MenuItem>
                <MenuItem value={'not-my-annotations'}>
                    {translate(
                        'my_annotations_filter_not_annotated_by_me_choice',
                    )}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

MyAnnotationsFilterComponent.propTypes = {
    filters: PropTypes.shape({
        resourceUris: PropTypes.array,
        excludedResourceUris: PropTypes.array,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    filters: fromSearch.getFilters(state),
});

const mapDispatchToProps = {
    onFilterChange: (value) => searchMyAnnotations(value),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyAnnotationsFilterComponent);
