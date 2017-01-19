import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

export const App = ({ isLoading, children }) => {
    const RightElement = isLoading
        ? <CircularProgress color="#fff" size={30} thickness={2} style={{ margin: 8 }} />
        : null;

    return (
        <MuiThemeProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar title="Lodex" iconElementRight={RightElement} />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                </div>
            </div>
        </MuiThemeProvider>
    );
};

App.propTypes = {
    isLoading: PropTypes.bool,
    children: PropTypes.node,
};

function mapStateToProps(state) {
    return { isLoading: state.loading };
}

export default connect(
  mapStateToProps,
)(App);
