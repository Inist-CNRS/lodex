import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import fetchPaginatedDataForComponent from '../../lib/fetchPaginatedDataForComponent';
import Alert from '../../lib/components/Alert';
import { REJECTED } from '../../../../common/propositionStatus';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fetchForIstexFormat } from '../shared/fetchIstexData';
import IstexItem from './IstexItem';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
    header: {
        borderBottom: '1px solid lightgrey',
        marginBottom: '1rem',
    },
    dl: {
        float: 'right',
    },
    total: {
        fontSize: '1.2rem',
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
            <a
                style={styles.dl}
                href={'https://dl.istex.fr/?q='.concat(
                    encodeURIComponent(resource[field.name]),
                )}
            >
                {polyglot.t('download')}
            </a>
            {error && (
                <Alert>
                    <p>{polyglot.t(error)}</p>
                </Alert>
            )}
        </div>
        {data &&
            data.hits && (
                <div>
                    {data.hits.map(item => (
                        <IstexItem key={item.id} {...item} />
                    ))}
                </div>
            )}
    </div>
);

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    data: PropTypes.shape({}),
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
