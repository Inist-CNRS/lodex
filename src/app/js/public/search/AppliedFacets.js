import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import withHandlers from 'recompose/withHandlers';

import { Chip } from 'material-ui';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromSearch } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { facetActions } from './reducer';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    chip: {
        margin: '.25rem !important',
    },
});

const AppliedFacets = ({ className, facets, p: polyglot, onRequestDelete }) => (
    <div className={classnames(css(styles.container), className)}>
        {facets.map(({ name, value, field, inverted }) => (
            <Chip
                key={name}
                className={css(styles.chip)}
                onRequestDelete={onRequestDelete(name)}
                title={`${field.label} ${
                    inverted ? '(' + polyglot.t('excluding') + ')' : ''
                }`}
                backgroundColor={inverted ? 'rgba(0, 0, 0, 0.87)' : null}
                labelColor={inverted ? 'rgb(224, 224, 224)' : null}
                deleteIconStyle={
                    inverted ? { fill: 'rgb(224, 224, 224)' } : null
                }
            >
                {value.map(v => v || polyglot.t('empty')).join(' | ')}
            </Chip>
        ))}
    </div>
);

AppliedFacets.propTypes = {
    className: PropTypes.string,
    facets: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            field: fieldPropTypes.isRequired,
        }),
    ).isRequired,
    p: polyglotPropTypes.isRequired,
    onRequestDelete: PropTypes.func.isRequired,
};

AppliedFacets.defaultProps = {
    className: null,
};

const mapStateToProps = state => {
    const facets = fromSearch.getAppliedFacetList(state);
    const invertedFields = fromSearch.getInvertedFacets(state);

    return {
        facets: facets.map(facet => ({
            ...facet,
            inverted: invertedFields.includes(facet.name),
            field: fromFields.getFieldByName(state, facet.name),
        })),
    };
};

const mapDispatchToProps = {
    clearFacet: facetActions.clearFacet,
};

export default compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withHandlers({
        onRequestDelete: ({ clearFacet }) => name => () => clearFacet(name),
    }),
)(AppliedFacets);
