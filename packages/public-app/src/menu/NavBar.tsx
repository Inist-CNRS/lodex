import { useCallback, useEffect, type ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { config } from '@fortawesome/fontawesome-svg-core';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { fromUser, fromFields } from '@lodex/frontend-common/sharedSelectors';
import { fromDisplayConfig, fromMenu } from '../selectors';
import { logout } from '@lodex/frontend-common/user/reducer';
import Drawer, { useDrawer, DRAWER_CLOSED } from '../Drawer';
import Search from '../search/Search';
import GraphSummary from '../graph/GraphSummary';
import AdvancedPage from './AdvancedPage';
import Favicon from '../Favicon';
import MenuItem, { type ConfigRole } from './MenuItem';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
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

type Menu = {
    role:
        | 'home'
        | 'graphs'
        | 'search'
        | 'admin'
        | 'sign-in'
        | 'sign-out'
        | 'custom';
    label: { en: string; fr: string };
    icon: string;
};

type NavBarProps = {
    role: 'admin' | 'user' | 'not logged';
    logout(): void;
    canBeSearched: boolean;
    hasGraph: boolean;
    leftMenu?: Menu[];
    rightMenu?: Menu[];
    topMenu?: Menu[];
    bottomMenu?: Menu[];
    advancedMenu: Menu[];
    advancedMenuButton: {
        label: {
            en: string;
            fr: string;
        };
        icon: string;
    };
    hasFacetFields: boolean;
    search: boolean;
    closeSearch(): void;
    isMultilingual: boolean;
};

export const NavBar = ({
    logout,
    role,
    canBeSearched,
    hasGraph,
    leftMenu,
    rightMenu,
    advancedMenu,
    advancedMenuButton,
    hasFacetFields,
    search,
    closeSearch,
    isMultilingual,
}: NavBarProps) => {
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
        (role: ConfigRole, suppressEvent = false) =>
        (evt: ChangeEvent<HTMLInputElement>) => {
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
                        {leftMenu.map((config, index) => (
                            <MenuItem
                                key={index}
                                config={config}
                                role={role}
                                canBeSearched={canBeSearched}
                                hasGraph={hasGraph}
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
                        {rightMenu.map((config, index) => (
                            <MenuItem
                                key={index}
                                config={config}
                                role={role}
                                canBeSearched={canBeSearched}
                                hasGraph={hasGraph}
                                onClick={handleMenuItemClick}
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
            <Drawer status={searchDrawer} onClose={toggleSearch}>
                {/*
                 // @ts-expect-error TS2322 */}
                <Search
                    className="search"
                    withFacets={hasFacetFields}
                    withDataset={search}
                />
            </Drawer>
            <Drawer status={graphDrawer} onClose={toggleGraph}>
                {/*
                 // @ts-expect-error TS2322 */}
                <GraphSummary />
            </Drawer>
            <Drawer status={advancedMenuDrawer} onClose={toggleAdvancedMenu}>
                <AdvancedPage
                    // @ts-expect-error TS2322
                    role={role}
                    canBeSearched={canBeSearched}
                    hasGraph={hasGraph}
                    onClick={handleMenuItemClick}
                    advancedMenu={advancedMenu}
                />
            </Drawer>
        </>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    role: fromUser.getRole(state),
    canBeSearched: fromFields.canBeSearched(state),
    hasGraph:
        fromFields.getGraphicFields(state).filter((f) => !!f.display).length >
        0,
    leftMenu: fromMenu.getLeftMenu(state),
    rightMenu: fromMenu.getRightMenu(state),
    advancedMenu: fromMenu.getAdvancedMenu(state),
    advancedMenuButton: fromMenu.getAdvancedMenuButton(state),
    hasFacetFields: fromFields.hasFacetFields(state),
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
