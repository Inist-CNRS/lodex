import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import FetchFold from './FetchFold';
import IstexItem from '../istex/IstexItem';
import { polyglot as polyblotPropTypes } from '../../propTypes';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { getVolumeData, getIssueData, getDocumentData } from './getIstexData';

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
