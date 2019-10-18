import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Link from '../../lib/components/Link';
import {
    field as fieldProptypes,
    resource as resourcePropTypes,
} from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import theme from '../../theme';
import stylesToClassname from '../../lib/stylesToClassName';

const ellipsis = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const styles = stylesToClassname(
    {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            borderTop: '1px solid rgba(153, 153, 153, 0.2)',
            ':hover': {
                backgroundColor: '#f8f8f8',
            },
        },
        link: {
            color: 'black',
            ':hover': {
                textDecoration: 'none !important',
                color: 'inherit',
            },
        },
        activeLink: {
            color: theme.orange.primary,
        },
        row: {
            flex: '0 0 auto',
        },
        title: {
            flex: '0 0 auto',
            fontWeight: 'bold',
            marginBottom: '.75rem',
            ...ellipsis,
        },
        description: {
            flex: '0 0 auto',
            marginBottom: '.75rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: 60,
            display: '-webkit-box',
            '-webkit-line-clamp': '3',
            '-webkit-box-orient': 'vertical',
        },
        details: {
            display: 'flex',
            flex: '0 0 auto',
            fontSize: 'smaller',
            color: '#555',
        },
        detailsColumn: {
            flex: '1 0 0',
            paddingRight: '1rem',
            ...ellipsis,
        },
    },
    'search-result',
);

class SearchResult extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.result.uri !== this.props.result.uri;
    }
    render() {
        const { fields, fieldNames, result, closeDrawer } = this.props;
        const titleField = fields.find(
            field => field.name === fieldNames.title,
        );
        const descriptionField = fields.find(
            field => field.name === fieldNames.description,
        );
        const firstDetailField = fields.find(
            field => field.name === fieldNames.detail1,
        );
        const secondDetailField = fields.find(
            field => field.name === fieldNames.detail2,
        );

        const shouldDisplayDetails =
            (firstDetailField && result[firstDetailField.name]) ||
            (secondDetailField && result[secondDetailField.name]);

        return (
            <Link
                routeAware
                to={getResourceUri(result)}
                className={classnames('search-result-link', styles.link)}
                onClick={closeDrawer}
                activeClassName={styles.activeLink}
            >
                <div
                    id={`search-result-${result.uri}`}
                    className={classnames('search-result', styles.container)}
                >
                    {titleField && result[titleField.name] && (
                        <div
                            className={classnames(
                                'search-result-title',
                                styles.title,
                            )}
                            title={result[titleField.name]}
                        >
                            {result[titleField.name]}
                        </div>
                    )}
                    {descriptionField && result[descriptionField.name] && (
                        <div
                            className={classnames(
                                'search-result-description',
                                styles.description,
                            )}
                            title={result[descriptionField.name]}
                        >
                            {result[descriptionField.name]}
                        </div>
                    )}
                    {shouldDisplayDetails && (
                        <div
                            className={classnames(
                                'search-result-details',
                                styles.details,
                            )}
                        >
                            {firstDetailField && result[firstDetailField.name] && (
                                <div
                                    className={classnames(
                                        'search-result-detail1',
                                        styles.detailsColumn,
                                    )}
                                    title={result[firstDetailField.name]}
                                >
                                    {result[firstDetailField.name]}
                                </div>
                            )}
                            {secondDetailField &&
                                result[secondDetailField.name] && (
                                    <div
                                        className={classnames(
                                            'search-result-detail2',
                                            styles.detailsColumn,
                                        )}
                                        title={result[secondDetailField.name]}
                                    >
                                        {result[secondDetailField.name]}
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </Link>
        );
    }
}

SearchResult.propTypes = {
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        detail1: PropTypes.string,
        detail2: PropTypes.string,
    }).isRequired,
    result: resourcePropTypes.isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

export default SearchResult;
