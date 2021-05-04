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
const LodexResource = props => {
    let id = props.id;
    let url = props.url;
    let title = props.title;
    let summary = props.summary;
    let summarySize = props.summarySize;
    let openInNewTab = props.openInNewTab;

    if (summarySize > 0) {
        let currentSize = 0;
        let finalOutput = [];
        const subStringList = summary.split(/\s+/);
        for (const substr of subStringList) {
            finalOutput.push(substr);
            currentSize += substr.length;
            if (currentSize >= summarySize) {
                finalOutput.push('…');
                break;
            }
        }
        summary = finalOutput.join(' ');
    }

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
    summary: PropTypes.string,
    summarySize: PropTypes.number,
    openInNewTab: PropTypes.bool,
};

LodexResource.defaultProps = {
    title: 'n/a',
    summary: '',
    summarySize: -1,
    openInNewTab: false,
};

export default LodexResource;
