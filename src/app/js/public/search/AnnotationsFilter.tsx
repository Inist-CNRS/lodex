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
import { useGetAnnotatedResourceUris } from '../../annotation/annotationStorage';
import { useTranslate } from '../../i18n/I18NContext';
import { fromSearch } from '../selectors';
import { searchAnnotations } from './reducer';

// @ts-expect-error TS7031
export const AnnotationsFilterComponent = ({ filter, onFilterChange }) => {
    const { translate } = useTranslate();

    const resourceUris = useGetAnnotatedResourceUris();
    return (
        <FormControl fullWidth>
            <InputLabel id="annotations-filter" shrink>
                {translate('annotations_filter')}
            </InputLabel>
            <Select
                displayEmpty
                // @ts-expect-error TS2322
                notched
                labelId="annotations-filter"
                value={filter ?? ''}
                input={
                    <OutlinedInput
                        notched
                        label={translate('annotations_filter')}
                        aria-labelled-by="annotations-filter"
                    />
                }
                onChange={(e) =>
                    onFilterChange({
                        mode: e.target.value || null,
                        resourceUris,
                    })
                }
            >
                <MenuItem value="">
                    {translate('annotations_filter_null_choice')}
                </MenuItem>
                <MenuItem value="not-annotated">
                    {translate('annotations_filter_not_annotated_choice')}
                </MenuItem>
                <MenuItem value="annotated">
                    {translate('annotations_filter_annotated_choice')}
                </MenuItem>
                <MenuItem value="my-annotations">
                    {translate('annotations_filter_annotated_by_me_choice')}
                </MenuItem>
                <MenuItem value="not-my-annotations">
                    {translate('annotations_filter_not_annotated_by_me_choice')}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

AnnotationsFilterComponent.propTypes = {
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    filter: fromSearch.getAnnotationsFilter(state) ?? '',
});

const mapDispatchToProps = {
    // @ts-expect-error TS7006
    onFilterChange: (value) => searchAnnotations(value),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AnnotationsFilterComponent);
