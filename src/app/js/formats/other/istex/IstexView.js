import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';
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
    fieldStatus,
    data,
    error,
    field,
    resource,
    p: polyglot,
}) => (
    <div className="istex-list" style={styles.text(fieldStatus)}>
        <div style={styles.header}>
            <span style={styles.total}>
                {polyglot.t('istex_total', {
                    total: data ? data.total : 0,
                })}
            </span>
            <Link
                style={styles.dl}
                href={`${ISTEX_SITE_URL}/?q=`.concat(
                    encodeURIComponent(resource[field.name]),
                )}
                target="_blank"
            >
                <FileDownload tooltip={polyglot.t('download')} />
            </Link>
            {error && (
                <Alert>
                    <p>{polyglot.t(error)}</p>
                </Alert>
            )}
        </div>
        {data && data.hits && (
            <div>
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
