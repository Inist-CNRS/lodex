import React, { Fragment, Component } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faChartArea } from '@fortawesome/free-solid-svg-icons/faChartArea';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { connect } from 'react-redux';
import { config } from '@fortawesome/fontawesome-svg-core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

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
            fontWeight: 'bold',
        },
        ':active': {
            color: '#F48022',
        },
    },
    menuItemIcon: {
        margin: '0 auto',
    },
    link: {
        textDecoration: 'none',
        ':hover': {
            textDecoration: 'none',
        },
        ':focus': {
            textDecoration: 'none',
        },
        ':visited': {
            textDecoration: 'none',
        },
    },
    last: {
        marginBottom: 0,
        marginTop: 'auto',
    },
});

export const MenuItem = ({ label, icon, ...props }) => (
    <div {...props} className={css(styles.menuItem)}>
        <FontAwesomeIcon icon={icon} className={css(styles.menuItemIcon)} />
        {label}
    </div>
);

MenuItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
};

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

    openGraph = () => {
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
        const {
            role,
            canBeSearched,
            graphFields,
            logout,
            p: polyglot,
        } = this.props;
        const { searchDrawer, graphDrawer } = this.state;

        return (
            <Fragment>
                <nav className={css(styles.container)}>
                    <Favicon className={css(styles.icon)} />
                    <div>
                        <Link to="/" className={css(styles.link)}>
                            <MenuItem
                                label={polyglot.t('home')}
                                icon={faHome}
                                onClick={this.closeAll}
                            />
                        </Link>
                        {!!graphFields.length && (
                            <MenuItem
                                label={polyglot.t('graphs')}
                                icon={faChartArea}
                                onClick={this.openGraph}
                            />
                        )}
                        {canBeSearched && (
                            <MenuItem
                                onClick={this.openSearch}
                                label={polyglot.t('search_placeholder')}
                                icon={faSearch}
                            />
                        )}
                    </div>
                    <div className={css(styles.last)}>
                        {role === 'admin' && (
                            <a href="/admin" className={css(styles.link)}>
                                <MenuItem
                                    label={polyglot.t('Admin')}
                                    icon={faCogs}
                                />
                            </a>
                        )}
                        {role === 'not logged' ? (
                            <Link to="/login" className={css(styles.link)}>
                                <MenuItem
                                    label={polyglot.t('sign in')}
                                    icon={faSignInAlt}
                                />
                            </Link>
                        ) : (
                            <Link to="/login" className={css(styles.link)}>
                                <MenuItem
                                    label={polyglot.t('sign_out')}
                                    icon={faSignOutAlt}
                                    onClick={logout}
                                />
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
    graphFields: fromFields.getGraphFields(state),
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
