import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';
import get from 'lodash.get';

import { REJECTED } from '../../../../common/propositionStatus';
import { field as fieldPropTypes } from '../../propTypes';
import { ISTEX_API_URL } from '../../../../common/externals';
import injectData from '../injectData';
import IstexYear from './IstexYear';

const styles = {
    text: memoize(status =>
        Object.assign({
            fontSize: '1.5rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
        }),
    ),
    li: {
        listStyleType: 'none',
    },
};

export const getYearUrl = ({ resource, field }) => {
    const value = resource[field.name];

    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${value}"`,
    )})&facet=publicationDate[perYear]&size=0&output=*`;
};

export class IstexSummaryView extends Component {
    render() {
        const { fieldStatus, formatData, field, resource } = this.props;

        return (
            <ul className="istex-yeal" style={styles.text(fieldStatus)}>
                {get(formatData, 'aggregations.publicationDate.buckets', [])
                    .sort((a, b) => a - b)
                    .map(({ keyAsString }) => (
                        <li key={keyAsString} style={styles.li}>
                            <IstexYear
                                year={keyAsString}
                                issn={resource[field.name]}
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
