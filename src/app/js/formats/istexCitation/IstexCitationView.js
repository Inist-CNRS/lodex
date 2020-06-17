import React from 'react';
import PropTypes from 'prop-types';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import injectData from '../injectData';
import InvalidFormat from '../InvalidFormat';
import { getCitationUrl, parseCitationData } from './getIstexCitationData';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';
import composeRenderProps from '../../lib/composeRenderProps';
import IstexList from '../istexSummary/IstexList';
import JournalFold from './JournalFold';
import IstexItem from '../istex/IstexItem';
import stylesToClassname from '../../lib/stylesToClassName';

export const IstexDocument = ({ item }) => <IstexItem {...item} />;

IstexDocument.propTypes = {
    item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export const getComposedComponent = () =>
    composeRenderProps([IstexList, JournalFold, IstexList, IstexDocument]);

const styles = stylesToClassname(
    {
        container: {
            position: 'relative',
        },
        embedButton: {
            position: 'absolute',
            top: 0,
            right: '-2rem',
        },
    },
    'istex-summary',
);

export const IstexCitationView = ({
    formatData,
    field,
    resource,
    searchedField,
    documentSortBy,
    p: polyglot,
}) => {
    if (!resource[field.name] || !searchedField) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    const data = parseCitationData(formatData);
    const ComposedComponent = getComposedComponent();

    return (
        <div className={`istex-summary ${styles.container}`}>
            <ComposedComponent
                data={data}
                value={resource[field.name]}
                searchedField={searchedField}
                documentSortBy={documentSortBy}
                polyglot={polyglot}
            />
        </div>
    );
};

IstexCitationView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired,
    field: fieldPropTypes.isRequired,
    formatData: PropTypes.shape({ hits: PropTypes.Array }),
    error: PropTypes.string,
    searchedField: PropTypes.oneOf(SEARCHED_FIELD_VALUES),
    documentSortBy: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    showEmbedButton: PropTypes.bool,
};

IstexCitationView.defaultProps = {
    className: null,
    fieldStatus: null,
    formatData: null,
    error: null,
    searchedField: CUSTOM_ISTEX_QUERY,
};

export default injectData(getCitationUrl)(IstexCitationView);
