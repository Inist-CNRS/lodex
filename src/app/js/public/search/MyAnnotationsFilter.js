import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchMyAnnotations } from './reducer';
import { fromSearch } from '../selectors';

export const MyAnnotationsFilterComponent = ({ filter, onFilterChange }) => {
    const { translate } = useTranslate();

    return (
        <FormControl>
            <InputLabel htmlFor="my-annotations-filter">
                {translate('my_annotations_filter')}
            </InputLabel>
            <Select
                sx={{ width: 200 }}
                labelId="my-annotations-filter"
                label={translate('my-annotations-filter')}
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
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
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    filter: fromSearch.getMyAnnotationsFilter(state),
});

const mapDispatchToProps = {
    onFilterChange: (value) => searchMyAnnotations(value),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyAnnotationsFilterComponent);
