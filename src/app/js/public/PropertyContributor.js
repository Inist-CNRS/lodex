import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    fromResource,
} from './selectors';
import {
    polyglot as polyglotPropTypes,
} from '../propTypes';
import propositionStatus, { PROPOSED, VALIDATED, REJECTED } from '../../../common/propositionStatus';

const styles = {
    container: status => ({
        display: 'flex',
        marginRight: '1rem',
        color: (status && status !== VALIDATED) ? 'grey' : 'black',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    }),
    name: {
        fontWeight: 'bold',
    },
    language: {
        marginLeft: '0.5rem',
        fontSize: '0.75em',
        color: 'grey',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
    },
};

const PropertyContributorComponent = ({
    contributor,
    fieldStatus,
    p: polyglot,
}) => {
    if (!contributor) {
        return null;
    }

    return (
        <div className="property_contributor" style={styles.scheme}>
            {
            fieldStatus === PROPOSED ?
                polyglot.t('contributed_by', { name: contributor })
            :
                polyglot.t('added_by', { name: contributor })
            }
        </div>

    );
};

PropertyContributorComponent.defaultProps = {
    fieldStatus: null,
    contributor: null,
};

PropertyContributorComponent.propTypes = {
    contributor: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    fieldStatus: PropTypes.oneOf(propositionStatus),
};

const mapStateToProps = (state, { fieldName }) => ({
    contributor: fromResource.getResourceContributorForField(state, fieldName),
});

const Property = compose(
    translate,
    connect(mapStateToProps),
)(PropertyContributorComponent);

export default Property;
