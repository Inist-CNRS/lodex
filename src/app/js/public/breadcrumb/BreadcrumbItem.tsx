import { useTranslate } from '../../i18n/I18NContext';

import stylesToClassname from '../../lib/stylesToClassName';
import Link from '../../lib/components/Link';

const styles = stylesToClassname(
    {
        link: {
            padding: '5px',
            color: 'var(--primary-main)',
            textDecoration: 'none',
            ':hover': {
                color: 'var(--secondary-main)',
                textDecoration: 'none',
            },
            ':focus': {
                textDecoration: 'none',
                color: 'var(--secondary-main)',
            },
            ':visited': {
                textDecoration: 'none',
            },
            ':active': {
                color: 'var(--secondary-main)',
            },
        },
    },
    'breadcrumb-item',
);

interface BreadcrumbItemProps {
    value: {
        label: {
            en: string;
            fr: string;
        };
        url: string;
        isExternal?: boolean;
    };
    p: unknown;
}

const BreadcrumbItem = ({ value }: BreadcrumbItemProps) => {
    const { locale } = useTranslate();
    const label = value.label[locale];
    const to = String(value.url).trim() || './';
    let props = {
        to,
    };

    if (to.startsWith('https://')) {
        props = {
            // @ts-expect-error TS2353
            href: to,
        };
    } else if (value.isExternal === true) {
        props = {
            // @ts-expect-error TS2353
            href: to,
            target: '_blank',
            rel: 'noopener noreferrer',
        };
    } else if (
        // if props.to contain .html, it's a static page. Use href instead of to with react-router default route
        to.indexOf('.html') !== -1 &&
        typeof sessionStorage !== 'undefined'
    ) {
        const tenant = sessionStorage?.getItem('lodex-tenant');
        props = {
            // @ts-expect-error TS2353
            href: `/instance/${tenant}/${to}`,
            rel: 'noopener noreferrer',
        };
    }

    return (
        // @ts-expect-error TS2739
        <Link className={styles.link} {...props}>
            {label}
        </Link>
    );
};

export default BreadcrumbItem;
