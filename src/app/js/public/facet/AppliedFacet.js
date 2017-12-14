import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import Chip from 'material-ui/Chip';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import getFieldClassName from '../../lib/getFieldClassName';
import { fromFields } from '../../sharedSelectors';
import { fromFacet } from '../selectors';
import { clearFacet } from './index';
import interleave from '../../lib/interleave';

const styles = {
    chip: {
        margin: 5,
    },
    chipLabel: {
        whiteSpace: 'normal',
    },
    labelValue: {
        whiteSpace: 'nowrap',
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
        labelStyle={styles.chipLabel}
        className={`applied-facet-${getFieldClassName(field)}`}
        onRequestDelete={onRequestDelete}
        backgroundColor={inverted && 'rgba(0, 0, 0, 0.87)'}
        labelColor={inverted && 'rgb(224, 224, 224)'}
        deleteIconStyle={inverted && { fill: 'rgb(224, 224, 224)' }}
    >
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
    </Chip>
);

AppliedFacetComponent.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    field: fieldPropTypes.isRequired,
    onRequestDelete: PropTypes.func.isRequired,
    inverted: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { name }) => ({
    field: fromFields.getFieldByName(state, name),
    inverted: fromFacet.isFacetValuesInverted(state, name),
});

const mapDispatchToProps = { onClearFacet: clearFacet };

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onRequestDelete: ({ name, onClearFacet }) => () => onClearFacet(name),
    }),
)(AppliedFacetComponent);
