import { Chip } from '@mui/material';

import getFieldClassName from '../../../../src/app/js/lib/getFieldClassName';
import interleave from '../../../../src/app/js/lib/interleave';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

const styles = {
    chip: {
        margin: '5px',
        maxWidth: '100%',
    },
};

export type AppliedFacetProps = {
    facetValues: { value: string }[];
    field: { label: string };
    onRequestDelete(...args: unknown[]): unknown;
    inverted: boolean;
};

export const AppliedFacetComponent = ({
    facetValues,
    field,
    inverted,
    onRequestDelete,
}: AppliedFacetProps) => {
    const { translate } = useTranslate();
    return (
        <Chip
            sx={styles.chip}
            className={`applied-facet-${getFieldClassName(field)}`}
            onDelete={onRequestDelete}
            label={
                <>
                    <b>
                        {inverted ? `${translate('excluding')} ` : ''}
                        {field.label}
                    </b>{' '}
                    {interleave(
                        facetValues.map((facetValue) => (
                            <span key={facetValue.value}>
                                {facetValue.value}
                            </span>
                        )),
                        <span> | </span>,
                    )}
                </>
            }
        />
    );
};

export default AppliedFacetComponent;
