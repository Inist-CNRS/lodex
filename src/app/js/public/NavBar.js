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
import { polyglot as polyglotPropTypes } from '../propTypes';
import Drawer from './Drawer';
import Search from './search/Search';
import GraphSummary from './graph/GraphSummary';
import Favicon from './Favicon';
import theme from '../theme';

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
        transition: 'filter 300ms ease-in-out', // , -webkit-filter 300ms ease-in-out
        filter: 'brightness(1)',
    },
    containerWithDrawer: {
        filter: 'brightness(0.98)',
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
            color: theme.orange.primary,
        },
        ':visited': {
            textDecoration: 'none',
        },
        ':active': {
            color: theme.orange.primary,
        },
    },
    active: {
        color: theme.orange.primary,
        ':hover': {
            color: theme.orange.primary,
        },
    },
    drawerActive: {
        color: `${theme.purple.primary} !important`,
        ':hover': {
            color: `${theme.purple.primary} !important`,
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
        color: theme.green.primary,
        cursor: 'pointer',
        justifyContent: 'center',
        userSelect: 'none',
        textTransform: 'capitalize',
        ':hover': {
            color: theme.purple.primary,
        },
        ':active': {
            color: theme.orange.primary,
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

    toggleSearch = () => {
        const { searchDrawer, graphDrawer } = this.state;

        if (graphDrawer === 'open') {
            this.toggleGraph();
        }

        if (searchDrawer === 'open') {
            this.setState({ searchDrawer: 'closing' }, () => {
                setTimeout(
                    () => this.setState({ searchDrawer: 'closed' }),
                    ANIMATION_DURATION,
                );
            });
            return;
        }

        this.setState({ searchDrawer: 'open' });
    };

    toggleGraph = () => {
        const { graphDrawer, searchDrawer } = this.state;

        if (searchDrawer === 'open') {
            this.toggleSearch();
        }

        if (graphDrawer === 'open') {
            this.setState({ graphDrawer: 'closing' }, () => {
                setTimeout(
                    () => this.setState({ graphDrawer: 'closed' }),
                    ANIMATION_DURATION,
                );
            });
            return;
        }

        this.setState({ graphDrawer: 'open' });
    };

    closeAll = () => {
        const { searchDrawer, graphDrawer } = this.state;

        if (searchDrawer === 'open') {
            this.toggleSearch();
        }

        if (graphDrawer === 'open') {
            this.toggleGraph();
        }
    };

    handleGraphItemClick = evt => {
        evt.preventDefault();
        this.toggleGraph();
    };

    render() {
        const {
            role,
            canBeSearched,
            hasGraph,
            logout,
            p: polyglot,
        } = this.props;
        const { searchDrawer, graphDrawer } = this.state;

        return (
            <Fragment>
                <nav
                    className={classnames(css(styles.container), {
                        [css(styles.containerWithDrawer)]:
                            searchDrawer === 'open' || graphDrawer === 'open',
                    })}
                >
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
                            {polyglot.t('resources')}
                        </NavLink>
                        {hasGraph && (
                            <NavLink
                                to="/graph"
                                onClick={this.handleGraphItemClick}
                                className={classnames(
                                    'nav-item',
                                    css(styles.menuItem),
                                    css(styles.link),
                                    {
                                        [css(styles.drawerActive)]:
                                            graphDrawer === 'open',
                                    },
                                )}
                                isActive={(location, params) =>
                                    get(location, 'url') === '/graph' &&
                                    get(params, 'pathname') !== '/graph'
                                }
                                activeClassName={css(styles.active)}
                            >
                                <FontAwesomeIcon
                                    icon={faChartArea}
                                    className={css(styles.menuItemIcon)}
                                />
                                {polyglot.t('graphs')}
                            </NavLink>
                        )}
                        {canBeSearched && (
                            <div
                                onClick={this.toggleSearch}
                                className={classnames(
                                    'nav-item',
                                    css(styles.menuItem),
                                    {
                                        [css(styles.drawerActive)]:
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
                    onClose={this.toggleGraph}
                    animationDuration={ANIMATION_DURATION}
                >
                    <GraphSummary closeDrawer={this.toggleGraph} />
                </Drawer>
                <Drawer
                    status={searchDrawer}
                    onClose={this.toggleSearch}
                    animationDuration={ANIMATION_DURATION}
                >
                    <Search closeDrawer={this.toggleSearch} />
                </Drawer>
            </Fragment>
        );
    }
}

NavBar.propTypes = {
    role: PropTypes.oneOf(['admin', 'user', 'notLogged']).isRequired,
    logout: PropTypes.func.isRequired,
    canBeSearched: PropTypes.bool.isRequired,
    hasGraph: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    role: fromUser.getRole(state),
    canBeSearched: fromFields.canBeSearched(state),
    hasGraph: fromFields.getGraphFields(state).length > 0,
});

const mapDispatchToProps = {
    logout,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(NavBar);
