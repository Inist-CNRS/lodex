import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchAnnotations } from './reducer';
import { fromSearch } from '../selectors';
import { useGetAnnotatedResourceUris } from '../../annotation/annotationStorage';

export const AnnotationsFilterComponent = ({ filter, onFilterChange }) => {
    const { translate } = useTranslate();

    const resourceUris = useGetAnnotatedResourceUris();
    return (
        <FormControl>
            <InputLabel id="annotations-filter">
                {translate('annotations_filter')}
            </InputLabel>
            <Select
                sx={{ width: 200 }}
                labelId="annotations-filter"
                label={translate('annotations-filter')}
                value={filter}
                inputProps={{ 'aria-labelled-by': 'annotations-filter' }}
                onChange={(e) =>
                    onFilterChange({ mode: e.target.value, resourceUris })
                }
            >
                <MenuItem value={null}>
                    {translate('annotations_filter_null_choice')}
                </MenuItem>
                <MenuItem value={'annotated'}>
                    {translate('annotations_filter_annotated_choice')}
                </MenuItem>
                <MenuItem value={'my-annotations'}>
                    {translate('annotations_filter_annotated_by_me_choice')}
                </MenuItem>
                <MenuItem value={'not-my-annotations'}>
                    {translate('annotations_filter_not_annotated_by_me_choice')}
                </MenuItem>
                <MenuItem value={'not-annotated'}>
                    {translate('annotations_filter_not_annotated_choice')}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

AnnotationsFilterComponent.propTypes = {
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    filter: fromSearch.getAnnotationsFilter(state),
});

const mapDispatchToProps = {
    onFilterChange: (value) => searchAnnotations(value),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AnnotationsFilterComponent);
