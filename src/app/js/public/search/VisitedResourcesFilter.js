import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchVisited } from './reducer';
import { fromSearch } from '../selectors';
import { useVisitedUris } from '../resource/useRememberVisit';

export const VisitedResourcesFilterComponent = ({ filter, onFilterChange }) => {
    const { translate } = useTranslate();

    const resourceUris = useVisitedUris();
    return (
        <FormControl>
            <InputLabel id="visited-filter">
                {translate('visited_filter')}
            </InputLabel>
            <Select
                sx={{ width: 300 }}
                labelId="visited-filter"
                label={translate('visited_filter')}
                value={filter}
                inputProps={{ 'aria-labelled-by': 'visited-filter' }}
                onChange={(e) =>
                    onFilterChange({ mode: e.target.value, resourceUris })
                }
            >
                <MenuItem value={null}>
                    {translate('visited_filter_null_choice')}
                </MenuItem>
                <MenuItem value={'visited'}>
                    {translate('visited_filter_visited_choice')}
                </MenuItem>
                <MenuItem value={'not-visited'}>
                    {translate('visited_filter_not_visited_choice')}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

VisitedResourcesFilterComponent.propTypes = {
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    filter: fromSearch.getVisitedFilter(state),
});

const mapDispatchToProps = {
    onFilterChange: (value) => searchVisited(value),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VisitedResourcesFilterComponent);
