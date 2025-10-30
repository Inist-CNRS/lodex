import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { fromUser } from '../../../src/app/js/sharedSelectors';
import stylesToClassname from '../../../src/app/js/lib/stylesToClassName';

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

interface AdminOnlyAlertComponentProps {
    children: React.ReactNode;
    isAdmin: boolean;
    className?: string;
}

export const AdminOnlyAlertComponent = ({
    children,
    isAdmin,
    className = 'alert',
}: AdminOnlyAlertComponentProps) =>
    isAdmin ? (
        // @ts-expect-error TS2339
        <div className={classnames(className, styles.alert)}>{children}</div>
    ) : null;

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    isAdmin: fromUser.isAdmin(state),
});

export default connect(mapStateToProps)(AdminOnlyAlertComponent);
