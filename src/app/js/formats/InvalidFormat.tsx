import React from 'react';
import PropTypes from 'prop-types';
import Warning from '@mui/icons-material/Warning';

import { polyglot as polyglotPropTypes } from '../propTypes';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import stylesToClassname from '../lib/stylesToClassName';
import { translate } from '../i18n/I18NContext';

// @ts-expect-error TS7006
const capitalize = (str) =>
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

// @ts-expect-error TS7006
const renderDetails = (polyglot, format = {}, value) => {
    // @ts-expect-error TS2339
    if (format === null || !format.name) {
        return null;
    }

    return (
        <ul>
            {/*
             // @ts-expect-error TS2339 */}
            {format.name ? (
                <li>
                    {capitalize(polyglot.t('format'))}:{' '}
                    {/*
                     // @ts-expect-error TS2339 */}
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

// @ts-expect-error TS7031
const InvalidFormat = ({ p: polyglot, format, value }) => (
    // @ts-expect-error TS2322
    <AdminOnlyAlert className="invalid-format">
        {/*
         // @ts-expect-error TS2339 */}
        <div className={styles.titleRow}>
            {/*
             // @ts-expect-error TS2339 */}
            <span className={styles.title}>
                <strong>{polyglot.t('bad_format_error')}</strong>
            </span>
            {/*
             // @ts-expect-error TS2339 */}
            <span className={styles.titleLogo}>
                <Warning style={iconStyle} />
            </span>
        </div>
        {/*
         // @ts-expect-error TS2339 */}
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
