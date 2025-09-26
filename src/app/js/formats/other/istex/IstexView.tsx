import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import FileDownload from '@mui/icons-material/GetApp';
import Link from '../../../lib/components/Link';

import fetchPaginatedDataForComponent from '../../../lib/fetchPaginatedDataForComponent';
import Alert from '../../../lib/components/Alert';
import { REJECTED } from '../../../../../common/propositionStatus';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';
import { fetchForIstexFormat } from '../../utils/fetchIstexData';
import IstexItem from './IstexItem';
import { ISTEX_SITE_URL } from '../../../../../common/externals';
import { translate } from '../../../i18n/I18NContext';

const styles = {
    // @ts-expect-error TS7006
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
    header: {
        borderBottom: '1px solid lightgrey',
        marginBottom: '1rem',
    },
    dl: {
        float: 'right',
    },
    total: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.54)',
    },
};

export const IstexView = ({
    // @ts-expect-error TS7031
    fieldStatus,
    // @ts-expect-error TS7031
    data,
    // @ts-expect-error TS7031
    error,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    p: polyglot,
}) => (
    <div className="istex-list" style={styles.text(fieldStatus)}>
        <div style={styles.header}>
            {/*
             // @ts-expect-error TS2322 */}
            <span style={styles.total}>
                {polyglot.t('istex_total', {
                    total: data ? data.total : 0,
                })}
            </span>
            {/*
             // @ts-expect-error TS2739 */}
            <Link
                style={styles.dl}
                href={`${ISTEX_SITE_URL}/?q=`.concat(
                    encodeURIComponent(resource[field.name]),
                )}
                target="_blank"
            >
                {/*
                 // @ts-expect-error TS2769 */}
                <FileDownload tooltip={polyglot.t('download')} />
            </Link>
            {error && (
                <Alert>
                    {/*
                     // @ts-expect-error TS2322 */}
                    <p>{polyglot.t(error)}</p>
                </Alert>
            )}
        </div>
        {data && data.hits && (
            <div>
                {/*
                 // @ts-expect-error TS7006 */}
                {data.hits.map((item) => (
                    <IstexItem key={item.id} {...item} />
                ))}
            </div>
        )}
    </div>
);

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired,
    field: fieldPropTypes.isRequired,
    data: PropTypes.shape({
        hits: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired,
    }),
    error: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

IstexView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default compose(
    translate,
    fetchPaginatedDataForComponent(fetchForIstexFormat),
)(IstexView);
