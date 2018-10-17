import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import FetchFold from './FetchFold';
import IstexItem from '../istex/IstexItem';
import { polyglot as polyblotPropTypes } from '../../propTypes';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { getVolumeData, getIssueData, getDocumentData } from './getIstexData';

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
        {({ name: volume, count }) => (
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
                {({ name: issue, count }) => (
                    <FetchFold
                        label={`${polyglot.t('issue')}: ${issue}`}
                        count={count}
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
    count: PropTypes.number.isRequired,
};

export default translate(IstexYear);
