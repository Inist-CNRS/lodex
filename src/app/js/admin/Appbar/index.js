import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import classnames from 'classnames';

import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import PublicationButton from '../publish/PublicationButton';
import ModelMenu from './ModelMenu';
import Settings from './Settings';
import UploadButton from '../upload/UploadButton';
import { fromUser } from '../../sharedSelectors';
import { fromPublication, fromParsing } from '../selectors';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';

const styles = {
    appBar: {
        zIndex: 1,
        height: 54,
        lineHeight: 'normal',
    },
    linkToHome: {
        color: 'white',
        textDecoration: 'none',
        marginRight: '1rem',
    },
    button: {
        color: 'black',
    },
    loading: {
        margin: 8,
    },
    buttons: {
        display: 'flex',
    },
    title: {
        lineHeight: '54px',
    },
};

const SubAppBar = translate(({ p: polyglot }) => {
    return (
        <Switch>
            <PrivateRoute path="/data">
                <ul>
                    <li>
                        <Link to="/data">Dataset</Link>
                    </li>
                    <li>
                        <FlatButton
                            label={polyglot.t('removed_resources')}
                            containerElement={<Link to="/data/removed" />}
                            style={{ ...styles.button }}
                        />
                    </li>
                </ul>
            </PrivateRoute>
            <PrivateRoute path="/display">DISPLAY</PrivateRoute>
        </Switch>
    );
});

const AppbarComponent = ({
    hasPublishedDataset,
    hasLoadedDataset,
    isLoading,
    isAdmin,
}) => {
    const LeftElement = isLoading ? (
        <CircularProgress
            color="#fff"
            size={30}
            thickness={2}
            style={styles.loading}
        />
    ) : (
        <span />
    );

    const RightElement = (
        <div style={styles.buttons}>
            <Link style={styles.button} to="/data">
                Data
            </Link>
            <Link style={styles.button} to="/display">
                Display
            </Link>
            {!isAdmin && <SignInButton />}

            {isAdmin && <SignOutButton />}
            {isAdmin && !hasPublishedDataset && <PublicationButton />}
        </div>
    );

    return (
        <div>
            <AppBar
                className="appbar"
                title={
                    <div style={styles.title}>
                        <Link to="/" style={styles.linkToHome}>
                            Lodex
                        </Link>
                    </div>
                }
                iconElementLeft={LeftElement}
                iconElementRight={RightElement}
                style={styles.appBar}
            />
            <SubAppBar hasPublishedDataset={hasPublishedDataset} />
        </div>
    );
};

AppbarComponent.propTypes = {
    hasPublishedDataset: PropTypes.bool.isRequired,
    hasLoadedDataset: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    isAdmin: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

AppbarComponent.defaultProps = {
    isLoading: false,
};

const mapStateToProps = state => ({
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    hasLoadedDataset: fromParsing.hasUploadedFile(state),
    isLoading: state.loading, // @TODO fix by adding a loading reducer handling all loading state
    isAdmin: fromUser.isAdmin(state),
});

export default compose(translate, connect(mapStateToProps))(AppbarComponent);
