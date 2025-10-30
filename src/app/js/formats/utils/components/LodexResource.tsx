import { isLocalURL, getResourceUri } from '@lodex/common';
import Link from '@lodex/frontend-common/components/Link';
import stylesToClassname from '../../../lib/stylesToClassName';
import { truncateByWords } from '../../stringUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

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

interface LodexResourceProps {
    id?: string;
    url?: string;
    title?: string;
    titleSize?: number;
    summary?: string;
    summarySize?: number;
    openInNewTab?: boolean;
}

// see https://jsonfeed.org/version/1#items
const LodexResource = ({
    title: titleProps = 'n/a',
    id,
    url,
    openInNewTab = false,
    summary: summaryProps = '',
    titleSize = -1,
    summarySize = -1,
}: LodexResourceProps) => {
    const { translate } = useTranslate();
    const summary = truncateByWords(summaryProps, summarySize);
    const title = truncateByWords(titleProps, titleSize);

    if (!id) {
        return null;
    }

    const content = (
        <div>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.contentTitle}>{title}</div>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.contentParagraph}>{summary}</div>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.contentCustomDiv} />
        </div>
    );

    const target = openInNewTab ? '_blank' : '';

    if (isLocalURL(id)) {
        return (
            <div id={id}>
                <Link
                    // @ts-expect-error TS2339
                    className={styles.contentLink}
                    to={getResourceUri({ uri: id })}
                    target={target}
                >
                    {content}
                </Link>
                {openInNewTab && (
                    <Link
                        // @ts-expect-error TS2339
                        className={styles.newTab}
                        to={getResourceUri({ uri: id })}
                        target={target}
                    >
                        <abbr title={translate('new_tab_label')}>
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
            {/*
             // @ts-expect-error TS2739 */}
            <Link className={styles.contentLink} href={url} target={target}>
                {content}
            </Link>
        </div>
    );
};

export default LodexResource;
