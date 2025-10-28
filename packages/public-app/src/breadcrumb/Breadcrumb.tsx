import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router';

import { fromBreadcrumb } from '../selectors';
import BreadcrumbItem from './BreadcrumbItem';
import stylesToClassname from '../../../../src/app/js/lib/stylesToClassName';
import Container from '@mui/material/Container';

const styles = stylesToClassname(
    {
        container: {},
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        icon: {
            color: 'var(--primary-main)',
            margin: '5px 0px',
        },
        trail: {
            margin: '5px 0px',
        },
    },
    'breadcrumb',
);

interface BreadcrumbProps {
    location: {
        pathname: string;
    };
    breadcrumb?: {
        value?: {
            label: {
                en: string;
                fr: string;
            };
            url: string;
        };
    }[];
}

export const Breadcrumb = ({ breadcrumb, location }: BreadcrumbProps) => {
    const isRoot = location.pathname === '/';

    if (
        !breadcrumb ||
        breadcrumb.length == 0 ||
        (breadcrumb.length == 1 && isRoot)
    ) {
        return null;
    }
    const items = isRoot
        ? breadcrumb.slice(0, breadcrumb.length - 1)
        : breadcrumb;

    return (
        <div id="breadcrumb">
            {/*
             // @ts-expect-error TS2339 */}
            <Container maxWidth="xl" className={`${styles.root} container`}>
                <FontAwesomeIcon
                    // @ts-expect-error TS2339
                    className={styles.icon}
                    icon={faAngleLeft}
                    height={20}
                />
                {/*
                 // @ts-expect-error TS2339 */}
                <div className={styles.trail}>
                    {items.map((item, index) => (
                        <>
                            <BreadcrumbItem
                                key={index}
                                // @ts-expect-error TS2339
                                value={item}
                                // @ts-expect-error TS2339
                                className={styles.item}
                            />
                            {index + 1 < items.length && <span>/</span>}
                        </>
                    ))}
                </div>
            </Container>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        breadcrumb: fromBreadcrumb.getBreadcrumb(state),
    };
};

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps), withRouter)(Breadcrumb);
