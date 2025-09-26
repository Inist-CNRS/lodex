import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import { fromResource } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import propositionStatus, {
    PROPOSED,
    VALIDATED,
    REJECTED,
} from '../../../../common/propositionStatus';

const styles = {
    // @ts-expect-error TS7006
    container: (status) => ({
        display: 'flex',
        marginRight: '1rem',
        color: status && status !== VALIDATED ? 'grey' : 'black',
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
    // @ts-expect-error TS7031
    contributor,
    // @ts-expect-error TS7031
    fieldStatus,
    // @ts-expect-error TS7031
    p: polyglot,
}) => {
    if (!contributor) {
        return null;
    }

    return (
        <div className="property_contributor" style={styles.scheme}>
            {fieldStatus === PROPOSED
                ? polyglot.t('contributed_by', { name: contributor })
                : polyglot.t('added_by', { name: contributor })}
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { fieldName }) => ({
    // @ts-expect-error TS2339
    contributor: fromResource.getResourceContributorForField(state, fieldName),
});

export default compose(
    translate,
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(PropertyContributorComponent);
