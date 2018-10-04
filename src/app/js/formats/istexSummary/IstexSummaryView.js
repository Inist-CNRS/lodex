import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { StyleSheet, css } from 'aphrodite/no-important';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyblotPropTypes,
} from '../../propTypes';
import { ISTEX_API_URL } from '../../../../common/externals';
import injectData from '../injectData';
import IstexItem from '../istex/IstexItem';
import classnames from 'classnames';
import FetchFold from './FetchFold';
import composeAsync from '../../../../common/lib/composeAsync';
import fetch from '../../lib/fetch';
import { parseFetchResult } from '../shared/fetchIstexData';

const styles = StyleSheet.create({
    text: {
        fontSize: '1.5rem',
    },
    rejected: {
        textDecoration: 'line-through',
    },
    li: {
        listStyleType: 'none',
    },
});

export const getYearUrl = ({ resource, field }) => {
    const value = resource[field.name];

    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${value}"`,
    )})&facet=publicationDate[perYear]&size=0&output=*`;
};

export const getVolumeUrl = ({ issn, year }) => () => ({
    url: `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}"`,
    )})&facet=host.volume[*-*:1]&size=0&output=*`,
});

export const parseVolumeData = ({ response, error }) => {
    if (error) {
        throw error;
    }

    return get(response, ['aggregations', 'host.volume', 'buckets'], []).map(
        ({ key }) => key,
    );
};

export const getVolumeData = ({ issn, year }) =>
    composeAsync(getVolumeUrl({ issn, year }), fetch, parseVolumeData);

export const getIssueUrl = ({ issn, year, volume }) => () => ({
    url: `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}" AND host.volume:"${
            volume
        }"`,
    )})&facet=host.issue[*-*:1]&size=0&output=*`,
});

export const parseIssueData = ({ response, error }) => {
    if (error) {
        throw error;
    }

    return get(response, ['aggregations', 'host.issue', 'buckets'], []).map(
        ({ key }) => key,
    );
};

export const getIssueData = ({ issn, year, volume }) =>
    composeAsync(getIssueUrl({ issn, year, volume }), fetch, parseIssueData);

export const getDocumentUrl = ({ issn, year, volume, issue }) => () => ({
    url: `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}" AND host.volume:"${
            volume
        }" AND host.issue:"${issue}"`,
    )})&size=10&output=*`,
});

export const getDocumentData = ({ issn, year, volume, issue }) =>
    composeAsync(
        getDocumentUrl({ issn, year, volume, issue }),
        fetch,
        parseFetchResult,
        ({ hits }) => hits,
    );

export class IstexSummaryView extends Component {
    render() {
        const { formatData, field, resource, p: polyglot } = this.props;

        return (
            <ul className={classnames('istex-year', css(styles.text))}>
                {get(formatData, 'aggregations.publicationDate.buckets', [])
                    .sort((a, b) => a.keyAsString - b.keyAsString)
                    .map(({ keyAsString }) => (
                        <li key={keyAsString} className={css(styles.li)}>
                            <FetchFold
                                label={keyAsString}
                                getData={getVolumeData({
                                    issn: resource[field.name],
                                    year: keyAsString,
                                })}
                                renderData={volume => (
                                    <FetchFold
                                        label={`${polyglot.t('volume')}: ${
                                            volume
                                        }`}
                                        getData={getIssueData({
                                            issn: resource[field.name],
                                            year: keyAsString,
                                            volume,
                                        })}
                                        renderData={issue => (
                                            <FetchFold
                                                label={`${polyglot.t(
                                                    'issue',
                                                )}: ${issue}`}
                                                getData={getDocumentData({
                                                    issn: resource[field.name],
                                                    year: keyAsString,
                                                    volume,
                                                    issue,
                                                })}
                                                renderData={document => (
                                                    <IstexItem
                                                        key={document.id}
                                                        {...document}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </li>
                    ))}
            </ul>
        );
    }
}

IstexSummaryView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    formatData: PropTypes.shape({}),
    error: PropTypes.string,
    p: polyblotPropTypes.isRequired,
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default compose(injectData(getYearUrl), translate)(IstexSummaryView);
