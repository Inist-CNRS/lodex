import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material';
import { connect } from 'react-redux';
import { useGetAnnotatedResourceUris } from '../../../../src/app/js/annotation/annotationStorage';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
import { fromSearch } from '../selectors';
import { searchAnnotations } from './reducer';

type AnnotationsFilterComponentProps = {
    filter?: string;
    onFilterChange(...args: unknown[]): unknown;
};

export const AnnotationsFilterComponent = ({
    filter,
    onFilterChange,
}: AnnotationsFilterComponentProps) => {
    const { translate } = useTranslate();

    const resourceUris = useGetAnnotatedResourceUris();
    return (
        <FormControl fullWidth>
            <InputLabel id="annotations-filter" shrink>
                {translate('annotations_filter')}
            </InputLabel>
            <Select
                displayEmpty
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
