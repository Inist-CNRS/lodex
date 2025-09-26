import React from 'react';
import PropTypes from 'prop-types';
import FileDownload from '@mui/icons-material/GetApp';
import Link from '../../../lib/components/Link';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';
import injectData from '../../injectData';
import InvalidFormat from '../../InvalidFormat';
import { getCitationUrl, parseCitationData } from './getIstexCitationData';
import {
    SEARCHED_FIELD_VALUES,
    CUSTOM_ISTEX_QUERY,
} from '../istexSummary/constants';
import composeRenderProps from '../../../lib/composeRenderProps';
import IstexCitationList from './IstexCitationList';
import JournalFold from './JournalFold';
import IstexItem from '../istex/IstexItem';
import stylesToClassname from '../../../lib/stylesToClassName';
import { ISTEX_SITE_URL } from '../../../../../common/externals';

// @ts-expect-error TS7031
export const IstexDocument = ({ item }) => <IstexItem {...item} />;

IstexDocument.propTypes = {
    item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export const getComposedComponent = () =>
    composeRenderProps([
        IstexCitationList,
        JournalFold,
        IstexCitationList,
        IstexDocument,
    ]);

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
    // @ts-expect-error TS7031
    formatData,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    searchedField,
    // @ts-expect-error TS7031
    documentSortBy,
    // @ts-expect-error TS7031
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
        // @ts-expect-error TS2339
        <div className={`istex-summary ${styles.container}`}>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.header}>
                {/*
                 // @ts-expect-error TS2339 */}
                <span className={styles.total}>
                    {polyglot.t('istex_total', {
                        total: formatData ? formatData.total : 0,
                    })}
                </span>
                {/*
                 // @ts-expect-error TS2739 */}
                <Link
                    // @ts-expect-error TS2339
                    className={styles.dl}
                    href={`${ISTEX_SITE_URL}/?q=`.concat(
                        encodeURIComponent(resource[field.name]),
                    )}
                    target="_blank"
                >
                    {/*
                     // @ts-expect-error TS2769 */}
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
    formatData: PropTypes.shape({
        hits: PropTypes.array,
        total: PropTypes.number,
    }),
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

// @ts-expect-error TS2345
export default injectData(getCitationUrl)(IstexCitationView);
