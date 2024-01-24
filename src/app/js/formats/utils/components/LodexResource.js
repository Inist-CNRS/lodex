import React from 'react';
import PropTypes from 'prop-types';

import { isLocalURL, getResourceUri } from '../../../../../common/uris';
import Link from '../../../lib/components/Link';
import stylesToClassname from '../../../lib/stylesToClassName';
import { truncateByWords } from '../../stringUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = stylesToClassname(
    {
        contentTitle: {
            fontSize: '16px',
            lineHeight: '20px',
            fontWeight: '400',
        },
        contentParagraph: {
            flex: '1 0 auto',
            color: '#A1A1A4',
            lineHeight: '16px',
        },
        contentLink: {
            cursor: 'pointer',
            textDecoration: 'inherit',
            color: 'inherit',
            fill: 'inherit',
            ':hover': {
                textDecoration: 'inherit',
                color: 'inherit',
                fill: 'inherit',
            },
            ':active': {
                textDecoration: 'inherit',
                color: 'inherit',
                fill: 'inherit',
            },
        },
        contentCustomDiv: {},
        newTab: {
            float: 'right',
            paddingLeft: '95%',
        },
    },
    'lodex-resource',
);

// see https://jsonfeed.org/version/1#items
const LodexResource = props => {
    const { id, url, openInNewTab, polyglot } = props;
    const summary = truncateByWords(props.summary, props.summarySize);
    const title = truncateByWords(props.title, props.titleSize);

    if (!id) {
        return null;
    }

    const content = (
        <div>
            <div className={styles.contentTitle}>{title}</div>
            <div className={styles.contentParagraph}>{summary}</div>
            <div className={styles.contentCustomDiv} />
        </div>
    );

    const target = openInNewTab ? '_blank' : '';

    if (isLocalURL(id)) {
        return (
            <div id={id}>
                <Link
                    className={styles.contentLink}
                    to={getResourceUri({ uri: id })}
                    target={target}
                >
                    {content}
                </Link>
                {openInNewTab && (
                    <Link
                        className={styles.newTab}
                        to={getResourceUri({ uri: id })}
                        target={target}
                    >
                        <abbr title={polyglot.t('new_tab_label')}>
                            <FontAwesomeIcon
                                icon={faExternalLinkAlt}
                                height={12}
                            />
                        </abbr>
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div id={id}>
            <Link className={styles.contentLink} href={url} target={target}>
                {content}
            </Link>
        </div>
    );
};

LodexResource.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    titleSize: PropTypes.number,
    summary: PropTypes.string,
    summarySize: PropTypes.number,
    openInNewTab: PropTypes.bool,
    polyglot: polyglotPropTypes,
};

LodexResource.defaultProps = {
    title: 'n/a',
    titleSize: -1,
    summary: '',
    summarySize: -1,
    openInNewTab: false,
    polyglot: undefined,
};

export default LodexResource;
