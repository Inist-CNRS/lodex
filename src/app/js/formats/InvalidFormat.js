import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Warning } from '@material-ui/icons';

import { polyglot as polyglotPropTypes } from '../propTypes';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import stylesToClassname from '../lib/stylesToClassName';

const capitalize = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const styles = stylesToClassname(
    {
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
    },
    'invalid-format',
);

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
        <div className={styles.titleRow}>
            <span className={styles.title}>
                <strong>{polyglot.t('bad_format_error')}</strong>
            </span>
            <span className={styles.titleLogo}>
                <Warning iconStyle={iconStyle} style={iconStyle} />
            </span>
        </div>
        <p className={styles.details}>{polyglot.t('bad_format_details')}</p>
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
