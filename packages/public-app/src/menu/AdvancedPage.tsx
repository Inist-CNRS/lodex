import classnames from 'classnames';

import stylesToClassname from '../../../../src/app/js/lib/stylesToClassName';
import MenuItem from './MenuItem';

const styles = stylesToClassname(
    {
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    'advanced-page',
);

interface AdvancedPageProps {
    advancedMenu: {
        role?:
            | 'home'
            | 'resources'
            | 'graphs'
            | 'search'
            | 'admin'
            | 'sign-in'
            | 'sign-out'
            | 'custom';
        label: {
            en: string;
            fr: string;
        };
        icon: string;
        link?: {
            startsWith(...args: unknown[]): unknown;
        };
    }[];
}

const AdvancedPage = ({ advancedMenu, ...rest }: AdvancedPageProps) => (
    // @ts-expect-error TS2339
    <div className={classnames('advanced-page', styles.root)}>
        {advancedMenu.map((config, index) => (
            // @ts-expect-error TS2739
            <MenuItem key={index} config={config} {...rest} />
        ))}
    </div>
);

export default AdvancedPage;
