import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import { getIconComponent } from '../../formats';
import MixedChartIcon from './MixedChartIcon';
import theme from '../../theme';
import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        activeLink: {
            color: theme.orange.primary,
            fill: theme.orange.primary,
            ':hover': {
                fill: theme.orange.primary,
                color: theme.orange.primary,
            },
        },
        link: {
            textDecoration: 'none',
            backgroundColor: '#f8f8f8',
            fill: theme.green.primary,
            color: theme.green.primary,
            cursor: 'pointer',
            userSelect: 'none',
            textTransform: 'capitalize',
            ':hover': {
                textDecoration: 'none',
                fill: theme.purple.primary,
                color: theme.purple.primary,
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
            width: 190,
            height: 190,
            margin: 10,
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            userSelect: 'none',
            textTransform: 'capitalize',
        },
        icon: {
            fontSize: '7em',
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        },
        label: {
            width: '100%',
        },
    },
    'graph-summary',
);

const PureGraphSummary = ({ graphFields, closeDrawer }) => (
    <div className={classnames('graph-summary', styles.container)}>
        {graphFields.map(field => {
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
                    activeClassName={classnames('active', styles.activeLink)}
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
);

PureGraphSummary.propTypes = {
    graphFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    graphFields: fromFields.getGraphFields(state),
});

export default connect(mapStateToProps)(PureGraphSummary);
