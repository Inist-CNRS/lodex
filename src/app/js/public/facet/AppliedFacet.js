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
    },
};

export const AppliedFacetComponent = ({
    value,
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
                    value.map(v => (
                        <span key={v} style={styles.labelValue}>
                            {v}
                        </span>
                    )),
                    <span> | </span>,
                )}
            </>
        }
    />
);

AppliedFacetComponent.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    field: fieldPropTypes.isRequired,
    onRequestDelete: PropTypes.func.isRequired,
    inverted: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(AppliedFacetComponent);
