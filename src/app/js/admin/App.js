import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './Appbar';

import { isLoggedIn as getIsLoggedIn } from '../user';

export const AppComponent = ({ children, isLoading, isLoggedIn }) => (
    <MuiThemeProvider>
        <div>
            <AppBar isLoading={isLoading} isLoggedIn={isLoggedIn} />

            <div className="body">
                {children}
            </div>
        </div>
    </MuiThemeProvider>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
};

AppComponent.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    isLoading: state.loading, // @TODO fix by adding a loading reducer handling all loading state
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(AppComponent);
