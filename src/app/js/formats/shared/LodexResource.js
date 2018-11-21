import React from 'react';
import PropTypes from 'prop-types';

import { isLocalURL, getResourceUri } from '../../../../common/uris';
import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';

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
    },
    'lodex-resource',
);

// see https://jsonfeed.org/version/1#items
const LodexResource = ({ id, url, title, summary }) => {
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

    if (isLocalURL(id)) {
        return (
            <div id={id}>
                <Link
                    className={styles.contentLink}
                    to={getResourceUri({ uri: id })}
                >
                    {content}
                </Link>
            </div>
        );
    }

    return (
        <div id={id}>
            <Link className={styles.contentLink} href={url}>
                {content}
            </Link>
        </div>
    );
};

LodexResource.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    summary: PropTypes.string,
};

LodexResource.defaultProps = {
    title: 'n/a',
    summary: '',
};

export default LodexResource;
