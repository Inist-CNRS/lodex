// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { fromUser } from '../../sharedSelectors';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        alert: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FDDBD3',
            padding: '2rem 1rem',
        },
    },
    'admin-only-alert',
);

export const AdminOnlyAlertComponent = ({
    // @ts-expect-error TS7031
    children,
    // @ts-expect-error TS7031
    isAdmin,
    className = 'alert',
}) =>
    isAdmin ? (
        // @ts-expect-error TS2339
        <div className={classnames(className, styles.alert)}>{children}</div>
    ) : null;

AdminOnlyAlertComponent.propTypes = {
    children: PropTypes.node.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    className: PropTypes.string,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    isAdmin: fromUser.isAdmin(state),
});

export default connect(mapStateToProps)(AdminOnlyAlertComponent);
