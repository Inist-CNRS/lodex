import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { StyleSheet, css } from 'aphrodite/no-important';

import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';
import classnames from 'classnames';
import IstexYear from './IstexYear';
import { ISTEX_API_URL } from '../../../../common/externals';
import InvalidFormat from '../InvalidFormat';

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

    if (!value) {
        return null;
    }

    const searchedField = get(field, 'format.args.searchedField');

    if (!searchedField) {
        return null;
    }

    return `${ISTEX_API_URL}/document/?q=(${encodeURIComponent(
        `${searchedField}:"${value}"`,
    )})&facet=publicationDate[perYear]&size=0&output=*`;
};

export const getYear = formatData =>
    get(formatData, 'aggregations.publicationDate.buckets', [])
        .sort((a, b) => a.keyAsString - b.keyAsString)
        .map(({ keyAsString }) => keyAsString);

export const IstexSummaryView = ({ formatData, field, resource }) => {
    if (!resource[field.name]) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }
    const searchedField = get(field, 'format.args.searchedField');

    return (
        <ul className={classnames('istex-year', css(styles.text))}>
            {getYear(formatData).map(year => (
                <li key={year} className={css(styles.li)}>
                    <IstexYear
                        issn={resource[field.name]}
                        year={year}
                        searchedField={searchedField}
                    />
                </li>
            ))}
        </ul>
    );
};

IstexSummaryView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    formatData: PropTypes.shape({}),
    error: PropTypes.string,
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default injectData(getYearUrl)(IstexSummaryView);
