import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import interleave from '../../lib/interleave';

const styles = {
    chip: {
        margin: 5,
        maxWidth: '100%',
    },
};

export const AppliedFacetComponent = ({
    facetValues,
    field,
    inverted,
    p: polyglot,
    onRequestDelete,
}) => (
    <Chip
        style={styles.chip}
        className={`applied-facet-${getFieldClassName(field)}`}
        onDelete={onRequestDelete}
        label={
            <>
                <b>
                    {inverted ? `${polyglot.t('excluding')} ` : ''}
                    {field.label}
                </b>{' '}
                {interleave(
                    facetValues.map(facetValue => (
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
