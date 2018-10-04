import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { StyleSheet, css } from 'aphrodite/no-important';

import { field as fieldPropTypes } from '../../propTypes';
import { ISTEX_API_URL } from '../../../../common/externals';
import injectData from '../injectData';
import classnames from 'classnames';
import IstexYear from './IstexYear';

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

export class IstexSummaryView extends Component {
    render() {
        const { formatData, field, resource } = this.props;

        return (
            <ul className={classnames('istex-year', css(styles.text))}>
                {get(formatData, 'aggregations.publicationDate.buckets', [])
                    .sort((a, b) => a.keyAsString - b.keyAsString)
                    .map(({ keyAsString }) => (
                        <li key={keyAsString} className={css(styles.li)}>
                            <IstexYear
                                issn={resource[field.name]}
                                year={keyAsString}
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
};

IstexSummaryView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default injectData(getYearUrl)(IstexSummaryView);
