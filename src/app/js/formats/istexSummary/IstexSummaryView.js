import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';

import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';
import classnames from 'classnames';
import IstexYear from './IstexYear';
import InvalidFormat from '../InvalidFormat';
import { getYearUrl, parseYearData } from './getIstexData';
import { searchedFieldValues } from './IstexSummaryAdmin';

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

export const IstexSummaryView = ({
    formatData,
    field,
    resource,
    searchedField,
}) => {
    if (!resource[field.name] || !searchedField) {
        return (
            <InvalidFormat format={field.format} value={resource[field.name]} />
        );
    }

    return (
        <ul className={classnames('istex-year', css(styles.text))}>
            {parseYearData(formatData).map(({ name, count }) => (
                <li key={name} className={css(styles.li)}>
                    <IstexYear
                        issn={resource[field.name]}
                        year={name}
                        count={count}
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
    searchedField: PropTypes.oneOf(searchedFieldValues),
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default injectData(getYearUrl)(IstexSummaryView);
