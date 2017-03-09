import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import { isLoggedIn as getIsLoggedIn } from '../user';
import ExportMenu from '../lib/Appbar/ExportMenu';
import ExportFieldsButton from '../lib/Appbar/ExportFieldsButton';

const styles = {
    icon: { color: 'black' },
};

export const ToolbarComponent = ({ isLoggedIn }) => (
    <Toolbar>
        <ToolbarGroup firstChild>
            <ExportMenu iconStyle={styles.icon} />
            {isLoggedIn && <ExportFieldsButton iconStyle={styles.icon} />}
        </ToolbarGroup>
    </Toolbar>
);

ToolbarComponent.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(ToolbarComponent);
