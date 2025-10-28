import { connect } from 'react-redux';
import classnames from 'classnames';

import { fromFields } from '../../../../src/app/js/sharedSelectors';
import { getIconComponent } from '../../../../src/app/js/formats';
import MixedChartIcon from './MixedChartIcon';
import Link from '../../../../src/app/js/lib/components/Link';
import stylesToClassname from '../../../../src/app/js/lib/stylesToClassName';
import { fromDisplayConfig, fromI18n } from '../selectors';

const styles = stylesToClassname(
    {
        container: {
            display: 'flex',
            justifyContent: 'center',
        },
        links: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: 20,
        },
        activeLink: {
            color: 'var(--secondary-main)',
            fill: 'var(--secondary-main)',
            ':hover': {
                fill: 'var(--secondary-main)',
                color: 'var(--secondary-main)',
            },
        },
        link: {
            textDecoration: 'none',
            backgroundColor: '#f8f8f8',
            fill: 'var(--primary-main)',
            color: 'var(--primary-main)',
            cursor: 'pointer',
            userSelect: 'none',
            textTransform: 'none',
            ':hover': {
                textDecoration: 'none',
                fill: 'var(--info-main)',
                color: 'var(--info-main)',
            },
            ':focus': {
                textDecoration: 'none',
            },
            ':visited': {
                textDecoration: 'none',
            },
        },
        item: {
            display: 'flex',
            width: 130,
            height: 130,
            margin: 5,
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            userSelect: 'none',
            textTransform: 'none',
            '@media (min-width: 768px)': {
                width: 160,
                height: 160,
                margin: 5,
            },
            '@media (min-width: 992px)': {
                width: 190,
                height: 190,
                margin: 10,
            },
        },
        icon: {
            fontSize: '7em',
        },
        label: {
            width: '100%',
        },
    },
    'graph-summary',
);

type PureGraphSummaryProps = {
    graphicFields: {
        name: string;
        language?: string;
    }[];
    closeDrawer(): void;
    isMultilingual: boolean;
    locale: string;
};

const PureGraphSummary = ({
    graphicFields,
    closeDrawer,
    isMultilingual,
    locale,
}: PureGraphSummaryProps) => {
    const filteredGraphs = graphicFields.filter(
        (graph) =>
            !isMultilingual || !graph.language || graph.language === locale,
    );
    return (
        // @ts-expect-error TS2339
        <div className={styles.container}>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={classnames('graph-summary', styles.links)}>
                {filteredGraphs.map((field) => {
                    const Icon = getIconComponent(field);
                    return (
                        <Link
                            routeAware
                            key={field.name}
                            className={classnames(
                                'graph-link',
                                // @ts-expect-error TS2339
                                styles.link,
                                // @ts-expect-error TS2339
                                styles.item,
                            )}
                            activeClassName={classnames(
                                'active',
                                // @ts-expect-error TS2339
                                styles.activeLink,
                            )}
                            to={`/graph/${field.name}`}
                            onClick={closeDrawer}
                        >
                            {Icon ? (
                                // @ts-expect-error TS2339
                                <Icon className={styles.icon} />
                            ) : (
                                // @ts-expect-error TS2339
                                <MixedChartIcon className={styles.icon} />
                            )}
                            {/*
                             // @ts-expect-error TS2339 */}
                            <div className={styles.label}>{field.label}</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    graphicFields: fromFields
        .getGraphicFields(state)
        .filter((f) => !!f.display),
    isMultilingual: fromDisplayConfig.isMultilingual(state),
    locale: fromI18n.getLocale(state),
});

export default connect(mapStateToProps)(PureGraphSummary);
