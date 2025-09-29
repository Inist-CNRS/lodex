import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Link from '../../lib/components/Link';
import {
    field as fieldPropTypes,
    resource as resourcePropTypes,
} from '../../propTypes';
// @ts-expect-error TS7016
import { isURL, getResourceUri } from '../../../../common/uris';
import stylesToClassname from '../../lib/stylesToClassName';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useIsVisited } from '../resource/useRememberVisit';

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
            paddingRight: '2.5rem',
            border: `1px solid var(--neutral-dark-light)`,
            backgroundColor: 'var(--contrast-main)',
            ':hover': {
                backgroundColor: 'var(--neutral-dark-very-light)',
            },
            marginBottom: '1rem',
            position: 'relative',
        },
        link: {
            color: 'black !important',
            ':hover': {
                textDecoration: 'none !important',
                color: 'inherit',
            },
            ':focus': {
                textDecoration: 'none !important',
                color: 'inherit',
            },
        },
        activeLink: {
            color: `var(--secondary-main) !important`,
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
            overflow: 'hidden',
            transition: '1s',
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
    },
    'search-result',
);

// @ts-expect-error TS7031
const SearchResult = ({ fields, fieldNames, result, closeDrawer }) => {
    const isVisited = useIsVisited(result);
    const [showMore, setShowMore] = React.useState(false);
    // @ts-expect-error TS7006
    const titleField = fields.find((field) => field.name === fieldNames.title);
    const descriptionField = fields.find(
        // @ts-expect-error TS7006
        (field) => field.name === fieldNames.description,
    );
    const firstDetailField = fields.find(
        // @ts-expect-error TS7006
        (field) => field.name === fieldNames.detail1,
    );
    const secondDetailField = fields.find(
        // @ts-expect-error TS7006
        (field) => field.name === fieldNames.detail2,
    );

    const thirdDetailField = fields.find(
        // @ts-expect-error TS7006
        (field) => field.name === fieldNames.detail3,
    );

    const shouldDisplayDetails =
        (firstDetailField && result[firstDetailField.name]) ||
        (secondDetailField && result[secondDetailField.name]);

    const linkProps = isURL(result.uri)
        ? { href: result.uri }
        : { to: getResourceUri(result) };
    return (
        // @ts-expect-error TS2322
        <Link
            {...linkProps}
            routeAware
            className={classnames(
                'search-result-link',
                // @ts-expect-error TS2339
                styles.link,
                // @ts-expect-error TS2339
                isVisited && styles.activeLink,
            )}
            onClick={closeDrawer}
        >
            <div
                id={`search-result-${result.uri}`}
                // @ts-expect-error TS2339
                className={classnames('search-result', styles.container)}
            >
                {titleField && result[titleField.name] && (
                    <Box
                        className={classnames(
                            'search-result-title',
                            // @ts-expect-error TS2339
                            styles.title,
                        )}
                        title={result[titleField.name]}
                        sx={
                            showMore
                                ? { maxHeight: 90000, transition: '1s' }
                                : { ...ellipsis }
                        }
                    >
                        {result[titleField.name]}
                    </Box>
                )}
                {thirdDetailField && result[thirdDetailField.name] && (
                    <div
                        className={classnames(
                            'search-result-detail-third',
                            // @ts-expect-error TS2339
                            styles.details,
                        )}
                    >
                        <div
                            className={classnames(
                                'search-result-detail-3',
                                // @ts-expect-error TS2339
                                styles.detailsColumn,
                            )}
                            title={result[thirdDetailField.name]}
                        >
                            {result[thirdDetailField.name]}
                        </div>
                    </div>
                )}
                {descriptionField && result[descriptionField.name] && (
                    <Box
                        className={classnames(
                            'search-result-description',
                            // @ts-expect-error TS2339
                            styles.description,
                        )}
                        title={result[descriptionField.name]}
                        sx={
                            showMore
                                ? { maxHeight: 90000, transition: '1s' }
                                : {
                                      textOverflow: 'ellipsis',
                                      transition: '1s',
                                      maxHeight: 60,
                                      display: '-webkit-box',
                                      '-webkit-line-clamp': '3',
                                      '-webkit-box-orient': 'vertical',
                                  }
                        }
                    >
                        {result[descriptionField.name]}
                    </Box>
                )}
                {shouldDisplayDetails && (
                    <div
                        className={classnames(
                            'search-result-details',
                            // @ts-expect-error TS2339
                            styles.details,
                        )}
                    >
                        {firstDetailField && result[firstDetailField.name] && (
                            <Box
                                className={classnames(
                                    'search-result-detail1',
                                    // @ts-expect-error TS2339
                                    styles.detailsColumn,
                                )}
                                title={result[firstDetailField.name]}
                                sx={
                                    showMore
                                        ? { maxHeight: 90000, transition: '1s' }
                                        : { ...ellipsis }
                                }
                            >
                                {result[firstDetailField.name]}
                            </Box>
                        )}
                        {secondDetailField &&
                            result[secondDetailField.name] && (
                                <Box
                                    className={classnames(
                                        'search-result-detail2',
                                        // @ts-expect-error TS2339
                                        styles.detailsColumn,
                                    )}
                                    title={result[secondDetailField.name]}
                                    sx={
                                        showMore
                                            ? {
                                                  maxHeight: 90000,
                                                  transition: '1s',
                                              }
                                            : { ...ellipsis }
                                    }
                                >
                                    {result[secondDetailField.name]}
                                </Box>
                            )}
                    </div>
                )}
                <ExpandMoreIcon
                    fontSize="large"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        cursor: 'pointer',
                        transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: '0.6s',
                        padding: '5px',
                        borderRadius: '50%',
                        ':hover': {
                            backgroundColor: 'var(--neutral-dark-very-light)',
                        },
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setShowMore(!showMore);
                    }}
                />
            </div>
        </Link>
    );
};

SearchResult.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    fieldNames: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        detail1: PropTypes.string,
        detail2: PropTypes.string,
        detail3: PropTypes.string,
    }).isRequired,
    result: resourcePropTypes.isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

export default memo(
    SearchResult,
    (prevProps, nextProps) => prevProps.result.uri === nextProps.result.uri,
);
