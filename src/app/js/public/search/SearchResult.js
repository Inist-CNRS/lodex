import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Link } from 'react-router-dom';

import {
    field as fieldProptypes,
    resource as resourcePropTypes,
} from '../../propTypes';

import { getResourceUri } from '../../../../common/uris';
import Format from '../Format';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0',
        borderTop: '2px solid black',
        ':hover': {
            backgroundColor: 'lightgray',
        },
    },
    link: {
        textDecoration: 'none !important',
        color: 'black',
    },
    row: {
        flex: '0 0 auto',
    },
    title: {
        flex: '0 0 auto',
        fontWeight: 'bold',
        marginBottom: '.75rem',
    },
    description: {
        flex: '0 0 auto',
        marginBottom: '.75rem',
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
    },
});

const cnames = (name, ...classes) => classnames(name, ...classes.map(css));

const SearchResult = ({ fields, fieldNames, result, closeDrawer }) => {
    const titleField = fields.find(field => field.name === fieldNames.title);
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
            to={getResourceUri(result)}
            className={cnames('search-result-link', styles.link)}
            onClick={closeDrawer}
        >
            <div
                id={`search-result-${result.uri}`}
                className={cnames('search-result', styles.container)}
            >
                {titleField &&
                    result[titleField.name] && (
                        <div
                            className={cnames(
                                'search-result-title',
                                styles.title,
                            )}
                        >
                            <Format field={titleField} resource={result} />
                        </div>
                    )}
                {descriptionField &&
                    result[descriptionField.name] && (
                        <div
                            className={cnames(
                                'search-result-description',
                                styles.description,
                            )}
                        >
                            <Format
                                field={descriptionField}
                                resource={result}
                            />
                        </div>
                    )}
                {shouldDisplayDetails && (
                    <div
                        className={cnames(
                            'search-result-details',
                            styles.details,
                        )}
                    >
                        {firstDetailField &&
                            result[firstDetailField.name] && (
                                <div
                                    className={cnames(
                                        'search-result-detail1',
                                        styles.detailsColumn,
                                    )}
                                >
                                    <Format
                                        field={firstDetailField}
                                        resource={result}
                                    />
                                </div>
                            )}
                        {secondDetailField &&
                            result[secondDetailField.name] && (
                                <div
                                    className={cnames(
                                        'search-result-detail2',
                                        styles.detailsColumn,
                                    )}
                                >
                                    <Format
                                        field={secondDetailField}
                                        resource={result}
                                    />
                                </div>
                            )}
                    </div>
                )}
            </div>
        </Link>
    );
};

SearchResult.propTypes = {
    fields: PropTypes.arrayOf(fieldProptypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    result: resourcePropTypes.isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

export default SearchResult;
