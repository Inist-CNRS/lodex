import React from 'react';
import PropTypes from 'prop-types';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import Link from '../../lib/components/Link';

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
import IstexCitationList from './IstexCitationList';
import JournalFold from './JournalFold';
import IstexItem from '../istex/IstexItem';
import stylesToClassname from '../../lib/stylesToClassName';
import { ISTEX_SITE_URL } from '../../../../../src/common/externals';

export const IstexDocument = ({ item }) => <IstexItem {...item} />;

IstexDocument.propTypes = {
    item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export const getComposedComponent = () =>
    composeRenderProps([IstexCitationList, JournalFold, IstexCitationList, IstexDocument]);

const styles = stylesToClassname(
    {
        container: {
            position: 'relative',
        },
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
            <div className={styles.header}>
                <span className={styles.total}>
                    {polyglot.t('istex_total', {
                        total: formatData ? formatData.total : 0,
                    })}
                </span>
                <Link
                    className={styles.dl}
                    href={`${ISTEX_SITE_URL}/?q=`.concat(
                        encodeURIComponent(resource[field.name]),
                    )}
                    target="_blank"
                >
                    <FileDownload tooltip={polyglot.t('download')} />
                </Link>
            </div>
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
};

IstexCitationView.defaultProps = {
    className: null,
    fieldStatus: null,
    formatData: null,
    error: null,
    searchedField: CUSTOM_ISTEX_QUERY,
};

export default injectData(getCitationUrl)(IstexCitationView);
