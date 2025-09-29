// @ts-expect-error TS6133
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { config } from '@fortawesome/fontawesome-svg-core';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { fromUser, fromFields } from '../../sharedSelectors';
import { fromDisplayConfig, fromMenu } from '../selectors';
import { logout } from '../../user';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Drawer, { useDrawer, DRAWER_CLOSED } from '../Drawer';
import Search from '../search/Search';
import GraphSummary from '../graph/GraphSummary';
import AdvancedPage from './AdvancedPage';
import Favicon from '../Favicon';
import MenuItem from './MenuItem';
import stylesToClassname from '../../lib/stylesToClassName';
import LanguageSelector from './LanguageSelector';
import Container from '@mui/material/Container';

config.autoAddCss = false;

const styles = stylesToClassname(
    {
        menu: {
            zIndex: 1150,
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
            height: 48,
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

export const NavBar = ({
    // @ts-expect-error TS7031
    logout,
    // @ts-expect-error TS7031
    role,
    // @ts-expect-error TS7031
    canBeSearched,
    // @ts-expect-error TS7031
    hasGraph,
    // @ts-expect-error TS7031
    leftMenu,
    // @ts-expect-error TS7031
    rightMenu,
    // @ts-expect-error TS7031
    advancedMenu,
    // @ts-expect-error TS7031
    advancedMenuButton,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    hasFacetFields,
    // @ts-expect-error TS7031
    search,
    // @ts-expect-error TS7031
    closeSearch,
    // @ts-expect-error TS7031
    isMultilingual,
}) => {
    const [searchDrawer, toggleSearchDrawer, closeSearchDrawer] =
        useDrawer(DRAWER_CLOSED);
    const [graphDrawer, toggleGraphDrawer, closeGraphDrawer] =
        useDrawer(DRAWER_CLOSED);
    const [
        advancedMenuDrawer,
        toggleAdvancedMenuDrawer,
        closeAdvancedMenuDrawer,
    ] = useDrawer(DRAWER_CLOSED);

    const toggleSearch = useCallback(() => {
        // @ts-expect-error TS2349
        closeAdvancedMenuDrawer();
        // @ts-expect-error TS2349
        closeGraphDrawer();

        // @ts-expect-error TS2349
        toggleSearchDrawer();
    }, [closeAdvancedMenuDrawer, closeGraphDrawer, toggleSearchDrawer]);

    useEffect(() => {
        if (search) {
            toggleSearch();
        }
    }, [search, toggleSearch]);

    useEffect(() => {
        if (searchDrawer == DRAWER_CLOSED) {
            closeSearch();
        }
    }, [closeSearch, searchDrawer]);

    const toggleGraph = () => {
        // @ts-expect-error TS2349
        closeAdvancedMenuDrawer();
        // @ts-expect-error TS2349
        closeSearchDrawer();

        // @ts-expect-error TS2349
        toggleGraphDrawer();
    };

    const toggleAdvancedMenu = () => {
        // @ts-expect-error TS2349
        closeSearchDrawer();
        // @ts-expect-error TS2349
        closeGraphDrawer();

        // @ts-expect-error TS2349
        toggleAdvancedMenuDrawer();
    };

    const closeAll = () => {
        // @ts-expect-error TS2349
        closeAdvancedMenuDrawer();
        // @ts-expect-error TS2349
        closeSearchDrawer();
        // @ts-expect-error TS2349
        closeGraphDrawer();
    };

    const handleMenuItemClick =
        // @ts-expect-error TS7006


            (role, suppressEvent = false) =>
            // @ts-expect-error TS7006
            (evt) => {
                if (suppressEvent) {
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

    if (!leftMenu || !rightMenu) {
        return null;
    }

    return (
        <>
            <nav
                // @ts-expect-error TS2339
                className={classnames(styles.menu, {
                    // @ts-expect-error TS2339
                    [styles.menuWithDrawer]:
                        searchDrawer === 'open' || graphDrawer === 'open',
                })}
            >
                <Container
                    maxWidth="xl"
                    // @ts-expect-error TS2339
                    className={classnames('container', styles.container)}
                >
                    {/*
                     // @ts-expect-error TS2769 */}
                    <Favicon className={styles.icon} />
                    {/*
                     // @ts-expect-error TS2339 */}
                    <div className={styles.first}>
                        {/*
                         // @ts-expect-error TS7006 */}
                        {leftMenu.map((config, index) => (
                            <MenuItem
                                key={index}
                                config={config}
                                role={role}
                                canBeSearched={canBeSearched}
                                hasGraph={hasGraph}
                                polyglot={polyglot}
                                onClick={handleMenuItemClick}
                                // @ts-expect-error TS2322
                                graphDrawer={graphDrawer}
                                // @ts-expect-error TS2322
                                searchDrawer={searchDrawer}
                                // @ts-expect-error TS2322
                                advancedDrawer={advancedMenuDrawer}
                            />
                        ))}
                    </div>
                    {/*
                     // @ts-expect-error TS2339 */}
                    <div className={styles.last}>
                        {/*
                         // @ts-expect-error TS7006 */}
                        {rightMenu.map((config, index) => (
                            <MenuItem
                                key={index}
                                config={config}
                                role={role}
                                canBeSearched={canBeSearched}
                                hasGraph={hasGraph}
                                onClick={handleMenuItemClick}
                                polyglot={polyglot}
                                // @ts-expect-error TS2322
                                graphDrawer={graphDrawer}
                                // @ts-expect-error TS2322
                                searchDrawer={searchDrawer}
                                // @ts-expect-error TS2322
                                advancedDrawer={advancedMenuDrawer}
                            />
                        ))}
                        {isMultilingual && <LanguageSelector />}
                    </div>
                    {advancedMenu.length > 0 && (
                        <MenuItem
                            config={{
                                ...advancedMenuButton,
                                role: 'advanced',
                            }}
                            role={role}
                            canBeSearched={canBeSearched}
                            hasGraph={hasGraph}
                            onClick={handleMenuItemClick}
                            polyglot={polyglot}
                            // @ts-expect-error TS2322
                            graphDrawer={graphDrawer}
                            // @ts-expect-error TS2322
                            searchDrawer={searchDrawer}
                            // @ts-expect-error TS2322
                            advancedDrawer={advancedMenuDrawer}
                        />
                    )}
                </Container>
            </nav>
            {/*
             // @ts-expect-error TS2322 */}
            <Drawer status={searchDrawer} onClose={toggleSearch}>
                {/*
                 // @ts-expect-error TS2322 */}
                <Search
                    // @ts-expect-error TS2322
                    className="search"
                    withFacets={hasFacetFields}
                    withDataset={search}
                />
            </Drawer>
            {/*
             // @ts-expect-error TS2322 */}
            <Drawer status={graphDrawer} onClose={toggleGraph}>
                {/*
                 // @ts-expect-error TS2322 */}
                <GraphSummary />
            </Drawer>
            {/*
             // @ts-expect-error TS2322 */}
            <Drawer status={advancedMenuDrawer} onClose={toggleAdvancedMenu}>
                {/*
                 // @ts-expect-error TS2322 */}
                <AdvancedPage
                    role={role}
                    canBeSearched={canBeSearched}
                    hasGraph={hasGraph}
                    onClick={handleMenuItemClick}
                    advancedMenu={advancedMenu}
                    polyglot={polyglot}
                />
            </Drawer>
        </>
    );
};

const menuPropTypes = PropTypes.arrayOf(
    PropTypes.shape({
        role: PropTypes.oneOf([
            'home',
            'graphs',
            'search',
            'admin',
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
    search: PropTypes.bool.isRequired,
    closeSearch: PropTypes.func.isRequired,
    isMultilingual: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    role: fromUser.getRole(state),
    // @ts-expect-error TS2339
    canBeSearched: fromFields.canBeSearched(state),
    hasGraph:
        // @ts-expect-error TS2339
        fromFields.getGraphicFields(state).filter((f) => !!f.display).length >
        0,
    // @ts-expect-error TS2339
    leftMenu: fromMenu.getLeftMenu(state),
    // @ts-expect-error TS2339
    rightMenu: fromMenu.getRightMenu(state),
    // @ts-expect-error TS2339
    advancedMenu: fromMenu.getAdvancedMenu(state),
    // @ts-expect-error TS2339
    advancedMenuButton: fromMenu.getAdvancedMenuButton(state),
    // @ts-expect-error TS2339
    hasFacetFields: fromFields.hasFacetFields(state),
    // @ts-expect-error TS2339
    isMultilingual: fromDisplayConfig.isMultilingual(state),
});

const mapDispatchToProps = {
    logout,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    // @ts-expect-error TS2345
)(NavBar);
