import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import classnames from 'classnames';
import { Box, type SxProps } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Link from '../../../components/Link';
import stylesToClassname from '../../../utils/stylesToClassName';
import { useTranslate } from '../../../i18n/I18NContext';

export const ellipsis: SxProps = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export const expandedSx: SxProps = { maxHeight: 90000, transition: '1s' };

const collapsedDescriptionSx: SxProps = {
    textOverflow: 'ellipsis',
    transition: '1s',
    maxHeight: 60,
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
};

const linkStates = {
    ':hover': {
        textDecoration: 'none !important',
        color: 'inherit',
    },
    ':focus': {
        textDecoration: 'none !important',
        color: 'inherit',
    },
};

const styles: Record<string, CSSProperties> = stylesToClassname(
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
            ...linkStates,
        },
        // Applied instead of `link`, never with it: both colors are !important.
        activeLink: {
            color: `var(--secondary-main) !important`,
            ...linkStates,
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
    },
    'search-result',
);

type ExpandableResourceCardProps = {
    domId?: string;
    title?: string;
    description?: string;
    to?: string | null;
    href?: string;
    routeAware?: boolean;
    target?: string;
    visited?: boolean; // shows the link in the secondary color
    onClick?: () => void;
    beforeDescription?: ReactNode;
    afterDescription?: (expanded: boolean) => ReactNode;
};

const ExpandableResourceCard = ({
    domId,
    title,
    description,
    to,
    href,
    routeAware,
    target,
    visited,
    onClick,
    beforeDescription,
    afterDescription,
}: ExpandableResourceCardProps) => {
    const { translate } = useTranslate();
    const [expanded, setExpanded] = useState(false);
    const titleId = useId();

    return (
        <Link
            to={to}
            href={href}
            routeAware={routeAware}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className={classnames(
                'search-result-link',
                visited ? styles.activeLink : styles.link,
            )}
            onClick={onClick}
            // the arrow button is inside the link: name the link after the
            // title only, not after its whole content with the button label
            aria-labelledby={title ? titleId : undefined}
        >
            <div
                id={domId}
                className={classnames('search-result', styles.container)}
            >
                {title && (
                    <Box
                        id={titleId}
                        className={classnames(
                            'search-result-title',
                            styles.title,
                        )}
                        title={title}
                        sx={expanded ? expandedSx : ellipsis}
                    >
                        {title}
                    </Box>
                )}
                {beforeDescription}
                {description && (
                    <Box
                        className={classnames(
                            'search-result-description',
                            styles.description,
                        )}
                        title={description}
                        sx={expanded ? expandedSx : collapsedDescriptionSx}
                    >
                        {description}
                    </Box>
                )}
                {afterDescription?.(expanded)}
                <ExpandMoreIcon
                    fontSize="large"
                    role="button"
                    tabIndex={0}
                    aria-hidden={false}
                    aria-expanded={expanded}
                    aria-label={translate(
                        expanded
                            ? 'resource_card_collapse'
                            : 'resource_card_expand',
                    )}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        cursor: 'pointer',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
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
                        setExpanded(!expanded);
                    }}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') {
                            return;
                        }
                        // the arrow is inside the link: unfold without following it
                        event.stopPropagation();
                        event.preventDefault();
                        // a held key repeats keydown: toggle once, like a native button
                        if (!event.repeat) {
                            setExpanded(!expanded);
                        }
                    }}
                />
            </div>
        </Link>
    );
};

export default ExpandableResourceCard;
