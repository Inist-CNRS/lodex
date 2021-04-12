import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import Link from '../../lib/components/Link';

import fetchDataForComponent from './fetchDataForComponent';
import Alert from '../../lib/components/Alert';
import { REJECTED } from '../../../../common/propositionStatus';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fetchForIstexRefbibsFormat } from './fetchIstexRefbibsData';
import IstexItem from '../istex/IstexItem';
import { ISTEX_SITE_URL } from '../../../../common/externals';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1rem',
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
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.54)',
    },
};

export const IstexRefbibsView = ({
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
            {error && (
                <Alert>
                    <p>{polyglot.t(error)}</p>
                </Alert>
            )}
        </div>
        {data && data.hits && (
            <div>
                {data.hits.map(item => (
                    <IstexItem key={item.id} {...item} />
                ))}
            </div>
        )}
    </div>
);

IstexRefbibsView.propTypes = {
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

IstexRefbibsView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default compose(
    translate,
    fetchDataForComponent(fetchForIstexRefbibsFormat),
)(IstexRefbibsView);
