import React, { PropTypes } from 'react';
import memoize from 'lodash.memoize';
import { List } from 'material-ui/List';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import fetchPaginatedDataForComponent from '../../lib/fetchPaginatedDataForComponent';
import Alert from '../../lib/components/Alert';
import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import fetchIstexData from './fetchIstexData';
import IstexItem from './IstexItem';

const styles = {
    text: memoize(status => Object.assign({
        fontSize: '1.5rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

export const IstexView = ({ fieldStatus, data, error, field, resource, p: polyglot }) => (
    <span style={styles.text(fieldStatus)}>
        <span>{polyglot.t('istex_results', { searchTerm: resource[field.name] })}</span>
        {error && <Alert><p>{polyglot.t(error)}</p></Alert>}
        {data && data.hits && <List>
            {
                data.hits.map(({ id, title, publicationDate, fulltext, abstract }) => (
                    <IstexItem
                        key={id}
                        fulltext={fulltext}
                        title={title}
                        publicationDate={publicationDate}
                        abstract={abstract}
                    />
                ))
            }
        </List>}
    </span>
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
    fetchPaginatedDataForComponent(fetchIstexData),
)(IstexView);
