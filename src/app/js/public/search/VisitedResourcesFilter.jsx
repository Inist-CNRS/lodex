import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useTranslate } from '../../i18n/I18NContext';
import { fromSearch } from '../selectors';
import { searchVisited } from './reducer';

export const VisitedResourcesFilterComponent = ({ filter, onFilterChange }) => {
    const { translate } = useTranslate();

    return (
        <FormControl fullWidth>
            <InputLabel id="visited-filter" shrink>
                {translate('visited_filter')}
            </InputLabel>
            <Select
                displayEmpty
                labelId="visited-filter"
                value={filter}
                input={
                    <OutlinedInput
                        notched
                        label={translate('visited_filter')}
                        aria-labelled-by="annotations-filter"
                    />
                }
                onChange={(e) =>
                    onFilterChange({ value: e.target.value || null })
                }
            >
                <MenuItem value="">
                    {translate('visited_filter_null_choice')}
                </MenuItem>
                <MenuItem value="visited">
                    {translate('visited_filter_visited_choice')}
                </MenuItem>
                <MenuItem value="not-visited">
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
    filter: fromSearch.getVisitedFilter(state) ?? '',
});

const mapDispatchToProps = {
    onFilterChange: (value) => searchVisited(value),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(VisitedResourcesFilterComponent);
