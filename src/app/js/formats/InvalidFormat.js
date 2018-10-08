import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import Warning from 'material-ui/svg-icons/alert/warning';

import { fromUser } from '../sharedSelectors';
import { polyglot as polyglotPropTypes } from '../propTypes';

const capitalize = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FDDBD3',
        padding: '2rem 1.5rem',
    },
    titleRow: {
        display: 'flex',
    },
    title: {
        flex: '1 0 0',
    },
    titleLogo: {
        flex: '1 0 0',
        textAlign: 'right',
    },
    details: {
        flex: '1 1 auto',
    },
});

const iconStyle = {
    width: 18,
    height: 18,
};

const renderDetails = (polyglot, format = {}, value) => {
    if (!format.name && value === undefined) {
        return null;
    }

    return (
        <ul>
            {format.name ? (
                <li>
                    {capitalize(polyglot.t('format'))}:{' '}
                    {polyglot.t(format.name)}
                </li>
            ) : null}
            <li>
                {capitalize(polyglot.t('value'))}:{' '}
                {value === undefined ? 'undefined' : JSON.stringify(value)}
            </li>
        </ul>
    );
};

const InvalidFormat = ({ p: polyglot, isAdmin, format, value }) => {
    if (!isAdmin) {
        return null;
    }

    return (
        <div className={classnames('invalid-format', css(styles.container))}>
            <div className={css(styles.titleRow)}>
                <span className={css(styles.title)}>
                    <strong>{polyglot.t('bad_format_error')}</strong>
                </span>
                <span className={css(styles.titleLogo)}>
                    <Warning iconStyle={iconStyle} style={iconStyle} />
                </span>
            </div>
            <p className={css(styles.details)}>
                {polyglot.t('bad_format_details')}
            </p>
            {renderDetails(polyglot, format, value)}
        </div>
    );
};

InvalidFormat.propTypes = {
    p: polyglotPropTypes.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    format: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
    value: PropTypes.any,
};

InvalidFormat.propTypes = {
    format: undefined,
    value: undefined,
};

const mapStateToProps = state => ({
    isAdmin: fromUser.isAdmin(state),
});

export default compose(translate, connect(mapStateToProps))(InvalidFormat);
