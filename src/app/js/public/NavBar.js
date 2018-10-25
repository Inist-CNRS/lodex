import React, { Fragment, Component } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Link, NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faChartArea } from '@fortawesome/free-solid-svg-icons/faChartArea';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { connect } from 'react-redux';
import { config } from '@fortawesome/fontawesome-svg-core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import get from 'lodash.get';

import { fromUser, fromFields } from '../sharedSelectors';
import { logout } from '../user';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import Drawer from './Drawer';
import Search from './search/Search';
import GraphSummary from './graph/GraphSummary';
import Favicon from './Favicon';

const ANIMATION_DURATION = 300; // ms

config.autoAddCss = false;

const styles = StyleSheet.create({
    container: {
        zIndex: 10000,
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        height: '100vh',
        minWidth: 110,
        maxWidth: 110,
        marginRight: 20,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 10,
        borderRight: '1px solid #E3EAF2',
    },
    icon: {
        maxHeight: 'fit-content',
        margin: '10px auto',
    },
    link: {
        textDecoration: 'none',
        ':hover': {
            textDecoration: 'none',
        },
        ':focus': {
            textDecoration: 'none',
            color: '#F48022',
        },
        ':visited': {
            textDecoration: 'none',
        },
        ':active': {
            color: '#F48022',
        },
    },
    active: {
        color: '#F48022',
        ':hover': {
            color: '#F48022',
        },
    },
    last: {
        marginBottom: 0,
        marginTop: 'auto',
    },
    menuItem: {
        width: '100%',
        height: 75,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        color: '#7DBD42',
        cursor: 'pointer',
        justifyContent: 'center',
        userSelect: 'none',
        textTransform: 'capitalize',
        ':hover': {
            color: '#B22F90',
        },
        ':active': {
            color: '#F48022',
        },
    },
    menuItemIcon: {
        margin: '0 auto',
    },
});

export class NavBar extends Component {
    state = {
        searchDrawer: 'closed',
        graphDrawer: 'closed',
    };

    openSearch = () => {
        const { searchDrawer } = this.state;

        if (searchDrawer === 'open') {
            return;
        }
        this.closeGraph();
        this.setState({ searchDrawer: 'open', graphDrawer: 'closing' });
    };

    closeSearch = () => {
        const { searchDrawer } = this.state;

        if (searchDrawer === 'closed') {
            return;
        }

        this.setState({ searchDrawer: 'closing' }, () => {
            setTimeout(
                () => this.setState({ searchDrawer: 'closed' }),
                ANIMATION_DURATION,
            );
        });
    };

    openGraph = e => {
        e.preventDefault();
        const { graphDrawer } = this.state;
        this.closeSearch();

        if (graphDrawer === 'open') {
            return;
        }

        this.setState({ graphDrawer: 'open' });
    };

    closeGraph = () => {
        const { graphDrawer } = this.state;

        if (graphDrawer === 'closed') {
            return;
        }

        this.setState({ graphDrawer: 'closing' }, () => {
            setTimeout(
                () => this.setState({ graphDrawer: 'closed' }),
                ANIMATION_DURATION,
            );
        });
    };

    closeAll = () => {
        this.closeSearch();
        this.closeGraph();
    };

    render() {
        const { role, canBeSearched, logout, p: polyglot } = this.props;
        const { searchDrawer, graphDrawer } = this.state;

        return (
            <Fragment>
                <nav className={css(styles.container)}>
                    <Favicon className={css(styles.icon)} />
                    <div>
                        <NavLink
                            to="/"
                            exact
                            className={classnames(
                                'nav-item',
                                css(styles.menuItem),
                                css(styles.link),
                            )}
                            activeClassName={css(styles.active)}
                            onClick={this.closeAll}
                        >
                            <FontAwesomeIcon
                                icon={faHome}
                                className={css(styles.menuItemIcon)}
                            />
                            {polyglot.t('home')}
                        </NavLink>
                        <NavLink
                            to="/graph"
                            exact
                            className={classnames(
                                'nav-item',
                                css(styles.menuItem),
                                css(styles.link),
                            )}
                            activeClassName={css(styles.active)}
                            onClick={this.closeAll}
                        >
                            <FontAwesomeIcon
                                icon={faList}
                                className={css(styles.menuItemIcon)}
                            />
                            {polyglot.t('dataset')}
                        </NavLink>
                        <NavLink
                            to="/graph"
                            onClick={this.openGraph}
                            isActive={(location, params) =>
                                get(location, 'url') === '/graph' &&
                                get(params, 'pathname') !== '/graph'
                            }
                            activeClassName={css(styles.active)}
                            className={classnames(
                                'nav-item',
                                css(styles.menuItem),
                                css(styles.link),
                                {
                                    [css(styles.active)]:
                                        graphDrawer === 'open',
                                },
                            )}
                        >
                            <FontAwesomeIcon
                                icon={faChartArea}
                                className={css(styles.menuItemIcon)}
                            />
                            {polyglot.t('graphs')}
                        </NavLink>
                        {canBeSearched && (
                            <div
                                onClick={this.openSearch}
                                className={classnames(
                                    'nav-item',
                                    css(styles.menuItem),
                                    {
                                        [css(styles.active)]:
                                            searchDrawer === 'open',
                                    },
                                )}
                            >
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className={css(styles.menuItemIcon)}
                                />
                                {polyglot.t('search_placeholder')}
                            </div>
                        )}
                    </div>
                    <div className={css(styles.last)}>
                        {role === 'admin' && (
                            <a
                                href="/admin"
                                className={classnames(
                                    'nav-item',
                                    css(styles.menuItem),
                                    {
                                        [css(styles.active)]:
                                            searchDrawer === 'open',
                                    },
                                )}
                            >
                                <FontAwesomeIcon
                                    icon={faCogs}
                                    className={css(styles.menuItemIcon)}
                                />
                                {polyglot.t('Admin')}
                            </a>
                        )}
                        {role === 'not logged' ? (
                            <Link
                                to="/login"
                                className={classnames(
                                    'nav-item',
                                    css(styles.menuItem),
                                    {
                                        [css(styles.active)]:
                                            searchDrawer === 'open',
                                    },
                                )}
                            >
                                <FontAwesomeIcon
                                    icon={faSignInAlt}
                                    className={css(styles.menuItemIcon)}
                                />
                                {polyglot.t('sign in')}
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className={classnames(
                                    'nav-item',
                                    css(styles.menuItem),
                                    {
                                        [css(styles.active)]:
                                            searchDrawer === 'open',
                                    },
                                )}
                                onClick={logout}
                            >
                                <FontAwesomeIcon
                                    icon={faSignOutAlt}
                                    className={css(styles.menuItemIcon)}
                                />
                                {polyglot.t('sign_out')}
                            </Link>
                        )}
                    </div>
                </nav>
                <Drawer
                    status={graphDrawer}
                    onClose={this.closeGraph}
                    animationDuration={ANIMATION_DURATION}
                >
                    <GraphSummary closeDrawer={this.closeGraph} />
                </Drawer>
                <Drawer
                    status={searchDrawer}
                    onClose={this.closeSearch}
                    animationDuration={ANIMATION_DURATION}
                >
                    <Search closeDrawer={this.closeSearch} />
                </Drawer>
            </Fragment>
        );
    }
}

NavBar.propTypes = {
    role: PropTypes.oneOf(['admin', 'user', 'notLogged']).isRequired,
    logout: PropTypes.func.isRequired,
    canBeSearched: PropTypes.bool.isRequired,
    graphFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStasteToProps = state => ({
    role: fromUser.getRole(state),
    canBeSearched: fromFields.canBeSearched(state),
});

const mapDispatchToProps = {
    logout,
};

export default compose(
    connect(
        mapStasteToProps,
        mapDispatchToProps,
    ),
    translate,
)(NavBar);
