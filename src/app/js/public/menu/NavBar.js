import React, { Fragment, Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { config } from '@fortawesome/fontawesome-svg-core';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { fromUser, fromFields } from '../../sharedSelectors';
import { fromMenu } from '../selectors';
import { logout } from '../../user';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Drawer from '../Drawer';
import Search from '../search/Search';
import AdvancedSearch from '../search/AdvancedSearch';
import GraphSummary from '../graph/GraphSummary';
import AdvancedPage from './AdvancedPage';
import Favicon from '../Favicon';
import MenuItem from './MenuItem';
import stylesToClassname from '../../lib/stylesToClassName';

const ANIMATION_DURATION = 300; // ms

config.autoAddCss = false;

const styles = stylesToClassname(
    {
        menu: {
            zIndex: 12000,
            position: 'fixed',
            bottom: 0,
            left: 0,
            backgroundColor: 'white',
            width: '100vw',
            minHeight: 80,
            maxHeight: 80,
            borderTop: '1px solid #E3EAF2',
            transition: 'filter 300ms ease-in-out', // -webkit-filter 300ms ease-in-out
            filter: 'brightness(1)',
        },
        menuWithDrawer: {
            filter: 'brightness(0.98)',
        },
        container: {
            display: 'flex',
            padding: '0px 10px',
        },
        icon: {
            maxHeight: 'fit-content',
            margin: '10px 10px auto',
            '@media (max-width: 768px)': {
                display: 'none',
            },
        },
        first: {
            display: 'flex',
        },
        last: {
            display: 'flex',
            marginRight: 0,
            marginLeft: 'auto',
        },
    },
    'nav-bar',
);

export class NavBar extends Component {
    state = {
        searchDrawer: 'closed',
        advancedSearchDrawer: 'closed',
        graphDrawer: 'closed',
        advancedDrawer: 'closed',
    };

    toggleSearch = () => {
        const {
            searchDrawer,
            graphDrawer,
            advancedSearchDrawer,
            advancedDrawer,
        } = this.state;

        if (graphDrawer === 'open') {
            this.toggleGraph();
        }

        if (advancedSearchDrawer === 'open') {
            this.toggleAdvancedSearch();
            return;
        }

        if (advancedDrawer === 'open') {
            this.toggleAdvancedGraph();
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

    toggleAdvancedSearch = () => {
        const { searchDrawer, advancedSearchDrawer } = this.state;

        if (advancedSearchDrawer === 'open') {
            this.setState({ advancedSearchDrawer: 'closed' });
            return;
        }

        if (searchDrawer === 'open') {
            this.setState({ advancedSearchDrawer: 'open' });
        }
    };

    toggleGraph = () => {
        const {
            graphDrawer,
            searchDrawer,
            advancedSearchDrawer,
            advancedDrawer,
        } = this.state;

        if (advancedSearchDrawer === 'open') {
            this.toggleAdvancedSearch();
            setTimeout(() => {
                this.toggleSearch();
                this.setState({ graphDrawer: 'open' });
            }, ANIMATION_DURATION);
            return;
        }

        if (searchDrawer === 'open') {
            this.toggleSearch();
        }

        if (advancedDrawer === 'open') {
            this.toggleAdvancedMenu();
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

    toggleAdvancedMenu = () => {
        const {
            graphDrawer,
            searchDrawer,
            advancedSearchDrawer,
            advancedDrawer,
        } = this.state;

        if (advancedSearchDrawer === 'open') {
            this.toggleAdvancedSearch();
            setTimeout(() => {
                this.toggleSearch();
                this.setState({ graphDrawer: 'open' });
            }, ANIMATION_DURATION);
            return;
        }

        if (searchDrawer === 'open') {
            this.toggleSearch();
        }

        if (graphDrawer === 'open') {
            this.toggleGraph();
        }

        if (advancedDrawer === 'open') {
            this.setState({ advancedDrawer: 'closing' }, () => {
                setTimeout(
                    () => this.setState({ advancedDrawer: 'closed' }),
                    ANIMATION_DURATION,
                );
            });
            return;
        }

        this.setState({ advancedDrawer: 'open' });
    };

    closeAll = () => {
        const {
            searchDrawer,
            graphDrawer,
            advancedSearchDrawer,
            advancedDrawer,
        } = this.state;

        if (advancedSearchDrawer === 'open') {
            this.toggleAdvancedSearch();
            setTimeout(() => {
                this.toggleSearch();
            }, ANIMATION_DURATION);
        }

        if (searchDrawer === 'open') {
            this.toggleSearch();
        }

        if (graphDrawer === 'open') {
            this.toggleGraph();
        }

        if (advancedDrawer === 'open') {
            this.toggleAdvancedMenu();
        }
    };

    handleMenuItemClick = (role, supressEvent = false) => evt => {
        if (supressEvent) {
            evt.preventDefault();
        }

        const { logout } = this.props;

        switch (role) {
            case 'graphs':
                this.toggleGraph();
                break;
            case 'search':
                this.toggleSearch();
                break;
            case 'sign-out':
                logout();
                break;
            case 'advanced':
                this.toggleAdvancedMenu();
                break;
            default:
                this.closeAll();
                return;
        }
    };

    render() {
        const {
            role,
            canBeSearched,
            hasGraph,
            leftMenu,
            rightMenu,
            advancedMenu,
            p: polyglot,
            hasFacetFields,
        } = this.props;

        if (!leftMenu || !rightMenu) {
            return null;
        }

        const {
            searchDrawer,
            graphDrawer,
            advancedSearchDrawer,
            advancedDrawer,
        } = this.state;

        return (
            <Fragment>
                <nav
                    className={classnames(styles.menu, {
                        [styles.menuWithDrawer]:
                            searchDrawer === 'open' || graphDrawer === 'open',
                    })}
                >
                    <div className={classnames('container', styles.container)}>
                        <Favicon className={styles.icon} />
                        <div className={styles.first}>
                            {leftMenu.map((config, index) => (
                                <MenuItem
                                    key={index}
                                    config={config}
                                    role={role}
                                    canBeSearched={canBeSearched}
                                    hasGraph={hasGraph}
                                    polyglot={polyglot}
                                    onClick={this.handleMenuItemClick}
                                    graphDrawer={graphDrawer}
                                    searchDrawer={searchDrawer}
                                    advancedDrawer={advancedDrawer}
                                />
                            ))}
                        </div>
                        <div className={styles.last}>
                            {rightMenu.map((config, index) => (
                                <MenuItem
                                    key={index}
                                    config={config}
                                    role={role}
                                    canBeSearched={canBeSearched}
                                    hasGraph={hasGraph}
                                    onClick={this.handleMenuItemClick}
                                    polyglot={polyglot}
                                    graphDrawer={graphDrawer}
                                    searchDrawer={searchDrawer}
                                    advancedDrawer={advancedDrawer}
                                />
                            ))}
                            {advancedMenu.length > 0 && (
                                <MenuItem
                                    key={'advanced'}
                                    config={{
                                        label: {
                                            en: 'Advanced',
                                            fr: 'Avancé',
                                        },
                                        icon: 'faCog',
                                        role: 'advanced',
                                    }}
                                    role={role}
                                    canBeSearched={canBeSearched}
                                    hasGraph={hasGraph}
                                    onClick={this.handleMenuItemClick}
                                    polyglot={polyglot}
                                    graphDrawer={graphDrawer}
                                    searchDrawer={searchDrawer}
                                    advancedDrawer={advancedDrawer}
                                />
                            )}
                        </div>
                    </div>
                </nav>
                {hasFacetFields && (
                    <Drawer
                        status={advancedSearchDrawer}
                        onClose={this.toggleAdvancedSearch}
                        animationDuration={ANIMATION_DURATION}
                        shift={440}
                    >
                        <AdvancedSearch />
                    </Drawer>
                )}
                <Drawer
                    status={searchDrawer}
                    onClose={this.toggleSearch}
                    animationDuration={ANIMATION_DURATION}
                    disabled={advancedSearchDrawer === 'open'}
                >
                    <Search
                        closeDrawer={this.toggleSearch}
                        showAdvancedSearch={hasFacetFields}
                        toggleAdvancedSearch={this.toggleAdvancedSearch}
                    />
                </Drawer>
                <Drawer
                    status={graphDrawer}
                    onClose={this.toggleGraph}
                    animationDuration={ANIMATION_DURATION}
                >
                    <GraphSummary closeDrawer={this.toggleGraph} />
                </Drawer>
                <Drawer
                    status={advancedDrawer}
                    onClose={this.toggleAdvancedMenu}
                    animationDuration={ANIMATION_DURATION}
                >
                    <AdvancedPage
                        role={role}
                        canBeSearched={canBeSearched}
                        hasGraph={hasGraph}
                        onClick={this.handleMenuItemClick}
                        advancedMenu={advancedMenu}
                        polyglot={polyglot}
                        closeDrawer={this.handleMenuItemClick}
                    />
                </Drawer>
            </Fragment>
        );
    }
}

const menuPropTypes = PropTypes.arrayOf(
    PropTypes.shape({
        role: PropTypes.oneOf([
            'home',
            'resources',
            'graphs',
            'search',
            'admin',
            'share_export',
            'sign-in',
            'sign-out',
            'custom',
        ]),
        label: PropTypes.shape({
            en: PropTypes.string.isRequired,
            fr: PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.string.isRequired,
    }),
);

NavBar.propTypes = {
    role: PropTypes.oneOf(['admin', 'user', 'not logged']).isRequired,
    logout: PropTypes.func.isRequired,
    canBeSearched: PropTypes.bool.isRequired,
    hasGraph: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    leftMenu: menuPropTypes,
    rightMenu: menuPropTypes,
    advancedMenu: menuPropTypes,
    loadMenu: PropTypes.func.isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    role: fromUser.getRole(state),
    canBeSearched: fromFields.canBeSearched(state),
    hasGraph: fromFields.getGraphFields(state).length > 0,
    leftMenu: fromMenu.getLeftMenu(state),
    rightMenu: fromMenu.getRightMenu(state),
    advancedMenu: fromMenu.getAdvancedMenu(state),
    hasFacetFields: fromFields.hasFacetFields(state),
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
