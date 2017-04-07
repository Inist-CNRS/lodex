import React, { PropTypes } from 'react';
import memoize from 'lodash.memoize';
import { List, ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';

import FetchPaginatedDataHOC from '../../lib/FetchPaginatedDataHOC';
import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    text: memoize(status => Object.assign({
        fontSize: '1.5rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
};

const IstexView = ({ fieldStatus, data, field, resource }) => {
    if (!data) {
        return null;
    }

    return (
        <span style={styles.text(fieldStatus)}>
            <span>ISTEX results for {resource[field.name]}:</span>
            <List>
                {
                    data.hits.map(({ id, title, publicationDate, fullText, abstract }) => (
                        <ListItem
                            key={id}
                            onClick={() => window.open(fullText)}
                            leftIcon={<PdfIcon />}
                            primaryText={`${title} ${publicationDate}`}
                            secondaryText={abstract}
                        />
                    ))
                }
            </List>
        </span>
    );
};

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    data: PropTypes.shape({}),
};

IstexView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
};

const fetchProps = async ({ resource, field }, page, perPage) => {
    const value = resource[field.name];
    const response = await fetch(`https://api.istex.fr/document/?q="${value}"&from=${page * perPage}&size=${perPage}&output=id,title,publicationDate,fulltext,abstract`);

    const { hits, total } = await response.json();

    return {
        hits: hits.map(hit => ({
            ...hit,
            fullText: hit.fulltext.find(({ extension }) => extension === 'pdf').uri,
        })),
        total,
    };
};

export default FetchPaginatedDataHOC(fetchProps, IstexView);
