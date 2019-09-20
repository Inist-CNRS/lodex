import React, { Fragment } from 'react';
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
import Drawer, { useDrawer, DRAWER_CLOSED } from '../Drawer';
import Search from '../search/Search';
import GraphSummary from '../graph/GraphSummary';
import AdvancedPage from './AdvancedPage';
import Favicon from '../Favicon';
import MenuItem from './MenuItem';
import stylesToClassname from '../../lib/stylesToClassName';

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

const NavBar = ({
    logout,
    role,
    canBeSearched,
    hasGraph,
    leftMenu,
    rightMenu,
    advancedMenu,
    advancedMenuButton,
    p: polyglot,
    hasFacetFields,
}) => {
    if (!leftMenu || !rightMenu) {
        return null;
    }

    const [searchDrawer, toggleSearchDrawer, closeSearchDrawer] = useDrawer(
        DRAWER_CLOSED,
    );
    const [graphDrawer, toggleGraphDrawer, closeGraphDrawer] = useDrawer(
        DRAWER_CLOSED,
    );
    const [
        advancedMenuDrawer,
        toggleAdvancedMenuDrawer,
        closeAdvancedMenuDrawer,
    ] = useDrawer(DRAWER_CLOSED);

    const toggleSearch = () => {
        closeAdvancedMenuDrawer();
        closeGraphDrawer();

        toggleSearchDrawer();
    };

    const toggleGraph = () => {
        closeAdvancedMenuDrawer();
        closeSearchDrawer();

        toggleGraphDrawer();
    };

    const toggleAdvancedMenu = () => {
        closeSearchDrawer();
        closeGraphDrawer();

        toggleAdvancedMenuDrawer();
    };

    const closeAll = () => {
        closeAdvancedMenuDrawer();
        closeSearchDrawer();
        closeGraphDrawer();
    };

    const handleMenuItemClick = (role, supressEvent = false) => evt => {
        if (supressEvent) {
            evt.preventDefault();
        }

        switch (role) {
            case 'graphs':
                toggleGraph();
                break;
            case 'search':
                toggleSearch();
                break;
            case 'sign-out':
                logout();
                break;
            case 'advanced':
                toggleAdvancedMenu();
                break;
            default:
                closeAll();
                return;
        }
    };

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
                                onClick={handleMenuItemClick}
                                graphDrawer={graphDrawer}
                                searchDrawer={searchDrawer}
                                advancedDrawer={advancedMenuDrawer}
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
                                onClick={handleMenuItemClick}
                                polyglot={polyglot}
                                graphDrawer={graphDrawer}
                                searchDrawer={searchDrawer}
                                advancedDrawer={advancedMenuDrawer}
                            />
                        ))}
                    </div>
                    {advancedMenu.length > 0 && (
                        <MenuItem
                            config={{ ...advancedMenuButton, role: 'advanced' }}
                            role={role}
                            canBeSearched={canBeSearched}
                            hasGraph={hasGraph}
                            onClick={handleMenuItemClick}
                            polyglot={polyglot}
                            graphDrawer={graphDrawer}
                            searchDrawer={searchDrawer}
                            advancedDrawer={advancedMenuDrawer}
                        />
                    )}
                </div>
            </nav>
            <Drawer status={searchDrawer} onClose={toggleSearch}>
                <Search showAdvancedSearch={hasFacetFields} />
            </Drawer>
            <Drawer status={graphDrawer} onClose={toggleGraph}>
                <GraphSummary />
            </Drawer>
            <Drawer status={advancedMenuDrawer} onClose={toggleAdvancedMenu}>
                <AdvancedPage
                    role={role}
                    canBeSearched={canBeSearched}
                    hasGraph={hasGraph}
                    onClick={handleMenuItemClick}
                    advancedMenu={advancedMenu}
                    polyglot={polyglot}
                />
            </Drawer>
        </Fragment>
    );
};

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
    topMenu: menuPropTypes,
    bottomMenu: menuPropTypes,
    advancedMenu: menuPropTypes,
    advancedMenuButton: PropTypes.shape({
        label: PropTypes.shape({
            en: PropTypes.string.isRequired,
            fr: PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.string.isRequired,
    }),
    hasFacetFields: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    role: fromUser.getRole(state),
    canBeSearched: fromFields.canBeSearched(state),
    hasGraph: fromFields.getGraphFields(state).length > 0,
    leftMenu: fromMenu.getLeftMenu(state),
    rightMenu: fromMenu.getRightMenu(state),
    advancedMenu: fromMenu.getAdvancedMenu(state),
    advancedMenuButton: fromMenu.getAdvancedMenuButton(state),
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
