import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import { getIconComponent } from '../../formats';
import { StyleSheet, css } from 'aphrodite/no-important';
import MixedChartIcon from './MixedChartIcon';
import theme from '../../theme';

const styles = StyleSheet.create({
    activeLink: {
        color: theme.orange,
        fill: theme.orange,
        ':hover': {
            fill: theme.orange,
            color: theme.orange,
        },
    },
    link: {
        textDecoration: 'none',
        backgroundColor: '#f8f8f8',
        fill: theme.green,
        color: theme.green,
        cursor: 'pointer',
        userSelect: 'none',
        textTransform: 'capitalize',
        ':hover': {
            textDecoration: 'none',
            fill: theme.purple,
            color: theme.purple,
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
        width: 192,
        height: 192,
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
    },
    label: {
        width: '100%',
    },
});

const PureGraphSummary = ({ graphFields, closeDrawer }) => (
    <div className={classnames('graph-summary', css(styles.container))}>
        {graphFields.map(field => {
            const Icon = getIconComponent(field);
            return (
                <NavLink
                    key={field.name}
                    className={classnames(
                        'graph-link',
                        css(styles.link),
                        css(styles.item),
                    )}
                    activeClassName={classnames(
                        'active',
                        css(styles.activeLink),
                    )}
                    to={`/graph/${field.name}`}
                    onClick={closeDrawer}
                >
                    {Icon ? (
                        <Icon className={css(styles.icon)} />
                    ) : (
                        <MixedChartIcon className={css(styles.icon)} />
                    )}
                    <div className={css(styles.label)}>{field.label}</div>
                </NavLink>
            );
        })}
    </div>
);

PureGraphSummary.propTypes = {
    graphFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    selected: PropTypes.string.isRequired,
    closeDrawer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    graphFields: fromFields.getGraphFields(state),
});

export default connect(mapStateToProps)(PureGraphSummary);
