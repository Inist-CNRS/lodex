import Warning from '@mui/icons-material/Warning';

import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import stylesToClassname from '../lib/stylesToClassName';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

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

interface InvalidFormatProps {
    p: unknown;
    format?: {
        name: string;
    };
    value?: any;
}

const InvalidFormat = ({ p: polyglot, format, value }: InvalidFormatProps) => (
    <AdminOnlyAlert className="invalid-format">
        {/*
         // @ts-expect-error TS2339 */}
        <div className={styles.titleRow}>
            {/*
             // @ts-expect-error TS2339 */}
            <span className={styles.title}>
                {/*
                 // @ts-expect-error TS18046 */}
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

export default translate(InvalidFormat);
