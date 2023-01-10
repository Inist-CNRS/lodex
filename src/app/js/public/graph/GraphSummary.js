import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import { getIconComponent } from '../../formats';
import MixedChartIcon from './MixedChartIcon';
import colorsTheme from '../../../custom/colorsTheme';
import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';

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
            color: colorsTheme.orange.primary,
            fill: colorsTheme.orange.primary,
            ':hover': {
                fill: colorsTheme.orange.primary,
                color: colorsTheme.orange.primary,
            },
        },
        link: {
            textDecoration: 'none',
            backgroundColor: '#f8f8f8',
            fill: colorsTheme.green.primary,
            color: colorsTheme.green.primary,
            cursor: 'pointer',
            userSelect: 'none',
            textTransform: 'capitalize',
            ':hover': {
                textDecoration: 'none',
                fill: colorsTheme.purple.primary,
                color: colorsTheme.purple.primary,
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
            textTransform: 'capitalize',
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

const PureGraphSummary = ({ graphicFields, closeDrawer }) => (
    <div className={styles.container}>
        <div className={classnames('graph-summary', styles.links)}>
            {graphicFields.map(field => {
                const Icon = getIconComponent(field);
                return (
                    <Link
                        routeAware
                        key={field.name}
                        className={classnames(
                            'graph-link',
                            styles.link,
                            styles.item,
                        )}
                        activeClassName={classnames(
                            'active',
                            styles.activeLink,
                        )}
                        to={`/graph/${field.name}`}
                        onClick={closeDrawer}
                    >
                        {Icon ? (
                            <Icon className={styles.icon} />
                        ) : (
                            <MixedChartIcon className={styles.icon} />
                        )}
                        <div className={styles.label}>{field.label}</div>
                    </Link>
                );
            })}
        </div>
    </div>
);

PureGraphSummary.propTypes = {
    graphicFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    graphicFields: fromFields.getGraphicFields(state).filter(f => !!f.display),
});

export default connect(mapStateToProps)(PureGraphSummary);
