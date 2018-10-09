import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite/no-important';
import Warning from 'material-ui/svg-icons/alert/warning';

import { polyglot as polyglotPropTypes } from '../propTypes';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';

const capitalize = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const styles = StyleSheet.create({
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

const InvalidFormat = ({ p: polyglot, format, value }) => (
    <AdminOnlyAlert className="invalid-format">
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
    </AdminOnlyAlert>
);

InvalidFormat.propTypes = {
    p: polyglotPropTypes.isRequired,
    format: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
    value: PropTypes.any,
};

InvalidFormat.propTypes = {
    format: undefined,
    value: undefined,
};

export default translate(InvalidFormat);
