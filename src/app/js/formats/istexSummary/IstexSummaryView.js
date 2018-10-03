import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { ISTEX_API_URL } from '../../../../common/externals';
import injectData from '../injectData';

const styles = {
    text: {
        fontSize: '1.5rem',
    },
};

export const getYearUrl = ({ resource, field }) => {
    const value = resource[field.name];

    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${value}"`,
    )})&facet=publicationDate[perYear]&size=0&output=*`;
};

export class IstexView extends Component {
    render() {
        const { fieldStatus, formatData } = this.props;

        return (
            <div className="istex-yeal" style={styles.text(fieldStatus)}>
                {get(
                    formatData,
                    'aggregations.publicationDate.buckets',
                    [],
                ).map(({ keyAsString }) => (
                    <p key={keyAsString}>{keyAsString}</p>
                ))}
            </div>
        );
    }
}

IstexView.propTypes = {
    fieldStatus: PropTypes.string,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: fieldPropTypes.isRequired,
    formatData: PropTypes.shape({}),
    error: PropTypes.string,
    p: polyglotPropTypes.isRequired,
};

IstexView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default injectData(getYearUrl)(IstexView);
