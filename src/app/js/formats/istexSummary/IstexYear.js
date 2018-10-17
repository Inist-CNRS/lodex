import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite/no-important';

import FetchFold from './FetchFold';
import IstexItem from '../istex/IstexItem';
import { polyglot as polyblotPropTypes } from '../../propTypes';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { getVolumeData, getIssueData, getDocumentData } from './getIstexData';

const styles = StyleSheet.create({
    li: {
        listStyleType: 'none',
    },
});

const IstexYear = ({ issn, year, count, searchedField, p: polyglot }) => (
    <FetchFold
        label={year}
        count={count}
        getData={getVolumeData({
            issn,
            year,
            searchedField,
        })}
    >
        {data => (
            <ul>
                {data.map(({ name: volume, count }) => (
                    <li key={volume} className={css(styles.li)}>
                        {
                            <FetchFold
                                label={`${polyglot.t('volume')}: ${volume}`}
                                count={count}
                                getData={getIssueData({
                                    issn,
                                    year,
                                    volume,
                                    searchedField,
                                })}
                            >
                                {data => (
                                    <ul>
                                        {data.map(({ name: issue, count }) => (
                                            <li
                                                key={issue}
                                                className={css(styles.li)}
                                            >
                                                <FetchFold
                                                    label={`${polyglot.t(
                                                        'issue',
                                                    )}: ${issue}`}
                                                    count={count}
                                                    getData={getDocumentData({
                                                        issn,
                                                        year,
                                                        volume,
                                                        issue,
                                                        searchedField,
                                                    })}
                                                >
                                                    {documents => (
                                                        <ul>
                                                            {documents.map(
                                                                istexDocument => (
                                                                    <IstexItem
                                                                        key={
                                                                            istexDocument.id
                                                                        }
                                                                        {...istexDocument}
                                                                    />
                                                                ),
                                                            )}
                                                        </ul>
                                                    )}
                                                </FetchFold>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </FetchFold>
                        }
                    </li>
                ))}
            </ul>
        )}
    </FetchFold>
);

IstexYear.propTypes = {
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    p: polyblotPropTypes.isRequired,
    count: PropTypes.number.isRequired,
};

export default translate(IstexYear);
