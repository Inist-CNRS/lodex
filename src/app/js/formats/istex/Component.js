import React, { PropTypes } from 'react';
import memoize from 'lodash.memoize';
import { List, ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import FetchPaginatedDataHOC from '../../lib/FetchPaginatedDataHOC';
import Alert from '../../lib/Alert';
import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import fetchIstexData from './fetchIstexData';

const styles = {
    text: memoize(status => Object.assign({
        fontSize: '1.5rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

const IstexView = ({ fieldStatus, data, error, field, resource, p: { t } }) => (
    <span style={styles.text(fieldStatus)}>
        <span>ISTEX results for {resource[field.name]}:</span>
        {error && <Alert><p>{t(error)}</p></Alert>}
        {data && <List>
            {
                data.hits.map(({ id, title, publicationDate, fulltext, abstract }) => (
                    <ListItem
                        key={id}
                        onClick={() => window.open(fulltext)}
                        leftIcon={<PdfIcon />}
                        primaryText={`${title} ${publicationDate}`}
                        secondaryText={abstract}
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
    FetchPaginatedDataHOC(fetchIstexData),
)(IstexView);
