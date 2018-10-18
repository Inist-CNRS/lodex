import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import FetchFold from './FetchFold';
import IstexItem from '../istex/IstexItem';
import { polyglot as polyblotPropTypes } from '../../propTypes';
import { searchedFieldValues } from './IstexSummaryAdmin';
import { getVolumeData, getIssueData, getDocumentData } from './getIstexData';
import IstexList from './IstexList';

const composeRenderProps = (parent, renderProps) => {
    const composedRender = renderProps.reverse().reduce((acc, render) => {
        if (!acc) {
            return render;
        }
        return (...args) => cloneElement(render(...args), { children: acc });
    }, null);

    return cloneElement(parent, {}, composedRender);
};

const IstexDocument = ({ item }) => <IstexItem {...item} />;

IstexDocument.propTypes = {
    item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

const IssueFold = ({
    item: { name: issue, count },
    issn,
    year,
    volume,
    searchedField,
    polyglot,
    children,
}) => (
    <FetchFold
        label={`${polyglot.t('issue')}: ${issue}`}
        count={count}
        issn={issn}
        year={year}
        volume={volume}
        issue={issue}
        searchedField={searchedField}
        getData={getDocumentData({
            issn,
            year,
            volume,
            issue,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

IssueFold.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    volume: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    children: PropTypes.func.isRequired,
    polyglot: polyblotPropTypes.isRequired,
};

const VolumeFold = ({
    item: { name: volume, count },
    issn,
    year,
    searchedField,
    children,
    polyglot,
}) => (
    <FetchFold
        label={`${polyglot.t('volume')}: ${volume}`}
        count={count}
        issn={issn}
        year={year}
        volume={volume}
        searchedField={searchedField}
        polyglot={polyglot}
        getData={getIssueData({
            issn,
            year,
            volume: volume,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

VolumeFold.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    children: PropTypes.func.isRequired,
    polyglot: polyblotPropTypes.isRequired,
};

const YearFold = ({ issn, year, count, searchedField, polyglot, children }) => (
    <FetchFold
        label={year}
        count={count}
        issn={issn}
        year={year}
        searchedField={searchedField}
        polyglot={polyglot}
        getData={getVolumeData({
            issn,
            year,
            searchedField,
        })}
    >
        {children}
    </FetchFold>
);

YearFold.propTypes = {
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    count: PropTypes.number.isRequired,
    children: PropTypes.func.isRequired,
    polyglot: polyblotPropTypes.isRequired,
};

const FoldList = props => <IstexList {...props} />;

const IstexYear = ({ issn, year, count, searchedField, p: polyglot }) =>
    composeRenderProps(
        <YearFold
            count={count}
            issn={issn}
            year={year}
            searchedField={searchedField}
            polyglot={polyglot}
        />,
        [FoldList, VolumeFold, FoldList, IssueFold, FoldList, IstexDocument],
    );

IstexYear.propTypes = {
    issn: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    searchedField: PropTypes.oneOf(searchedFieldValues),
    p: polyblotPropTypes.isRequired,
    count: PropTypes.number.isRequired,
};

export default translate(IstexYear);
