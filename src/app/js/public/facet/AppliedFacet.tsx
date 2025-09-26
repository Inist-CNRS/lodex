import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { translate } from '../../i18n/I18NContext';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import interleave from '../../lib/interleave';

const styles = {
    chip: {
        margin: '5px',
        maxWidth: '100%',
    },
};

export const AppliedFacetComponent = ({
    // @ts-expect-error TS7031
    facetValues,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    inverted,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    onRequestDelete,
}) => (
    <Chip
        sx={styles.chip}
        className={`applied-facet-${getFieldClassName(field)}`}
        onDelete={onRequestDelete}
        label={
            <>
                <b>
                    {inverted ? `${polyglot.t('excluding')} ` : ''}
                    {field.label}
                </b>{' '}
                {interleave(
                    // @ts-expect-error TS7006
                    facetValues.map((facetValue) => (
                        // @ts-expect-error TS2339
                        <span key={facetValue.value} style={styles.labelValue}>
                            {facetValue.value}
                        </span>
                    )),
                    <span> | </span>,
                )}
            </>
        }
    />
);

AppliedFacetComponent.propTypes = {
    facetValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    field: fieldPropTypes.isRequired,
    onRequestDelete: PropTypes.func.isRequired,
    inverted: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(AppliedFacetComponent);
