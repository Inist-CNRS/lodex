import React from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import FetchFold from './FetchFold';
import IstexItem from '../istex/IstexItem';
import composeAsync from '../../../../common/lib/composeAsync';
import { parseFetchResult } from '../shared/fetchIstexData';
import { polyglot as polyblotPropTypes } from '../../propTypes';
import fetch from '../../lib/fetch';
import { ISTEX_API_URL } from '../../../../common/externals';
import { searchedFieldValues } from './IstexSummaryAdmin';

export const getVolumeUrl = ({ issn, year, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${year}"`,
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

export const getVolumeData = ({ issn, year, searchedField }) =>
    composeAsync(
        getVolumeUrl({ issn, year, searchedField }),
        fetch,
        parseVolumeData,
    );

export const getIssueUrl = ({ issn, year, volume, searchedField }) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${
            year
        }" AND host.volume:"${volume}"`,
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

export const getIssueData = ({ issn, year, volume, searchedField }) =>
    composeAsync(
        getIssueUrl({ issn, year, volume, searchedField }),
        fetch,
        parseIssueData,
    );

export const getDocumentUrl = ({
    issn,
    year,
    volume,
    issue,
    searchedField,
}) => () => ({
    url: `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${issn}" AND publicationDate:"${
            year
        }" AND host.volume:"${volume}" AND host.issue:"${issue}"`,
    )})&size=10&output=id,arkIstex,title,publicationDate,author,host.genre,host.title`,
});

export const getDocumentData = ({ issn, year, volume, issue, searchedField }) =>
    composeAsync(
        getDocumentUrl({ issn, year, volume, issue, searchedField }),
        fetch,
        parseFetchResult,
        ({ hits }) => hits,
    );

const IstexYear = ({ issn, year, searchedField, p: polyglot }) => (
    <FetchFold
        label={year}
        getData={getVolumeData({
            issn,
            year,
            searchedField,
        })}
    >
        {volume => (
            <FetchFold
                label={`${polyglot.t('volume')}: ${volume}`}
                getData={getIssueData({
                    issn,
                    year,
                    volume,
                    searchedField,
                })}
            >
                {issue => (
                    <FetchFold
                        label={`${polyglot.t('issue')}: ${issue}`}
                        getData={getDocumentData({
                            issn,
                            year,
                            volume,
                            issue,
                            searchedField,
                        })}
                    >
                        {istexDocument => (
                            <IstexItem
                                key={istexDocument.id}
                                {...istexDocument}
                            />
                        )}
                    </FetchFold>
                )}
            </FetchFold>
        )}
    </FetchFold>
);

IstexYear.propTypes = {
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    p: polyblotPropTypes.isRequired,
};

export default translate(IstexYear);
