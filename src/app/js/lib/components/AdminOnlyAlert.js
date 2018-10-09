import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { fromUser } from '../../sharedSelectors';

const styles = StyleSheet.create({
    alert: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FDDBD3',
        padding: '2rem 1.5rem',
    },
});

export const AdminOnlyAlertComponent = ({
    children,
    isAdmin,
    className = 'alert',
}) =>
    isAdmin ? (
        <div className={classnames(className, css(styles.alert))}>
            {children}
        </div>
    ) : null;

AdminOnlyAlertComponent.propTypes = {
    children: PropTypes.node.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

const mapStateToProps = state => ({
    isAdmin: fromUser.isAdmin(state),
});

export default connect(mapStateToProps)(AdminOnlyAlertComponent);
