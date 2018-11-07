import React, { Fragment, Component } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
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
import Favicon from '../Favicon';
import MenuItem from './MenuItem';

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
        transition: 'filter 300ms ease-in-out', // -webkit-filter 300ms ease-in-out
        filter: 'brightness(1)',
    },
    containerWithDrawer: {
        filter: 'brightness(0.98)',
    },
    icon: {
        maxHeight: 'fit-content',
        margin: '10px auto',
    },
    last: {
        marginBottom: 0,
        marginTop: 'auto',
    },
});

export class NavBar extends Component {
    state = {
        searchDrawer: 'closed',
        advancedSearchDrawer: 'closed',
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
            topMenu,
            bottomMenu,
            p: polyglot,
            hasFacetFields,
        } = this.props;

        if (!topMenu || !bottomMenu) {
            return null;
        }

        const { searchDrawer, graphDrawer, advancedSearchDrawer } = this.state;

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
                        {topMenu.map((config, index) => (
                            <MenuItem
                                key={index}
                                config={config}
                                role={role}
                                canBeSearched={canBeSearched}
                                hasGraph={hasGraph}
                                logout={logout}
                                polyglot={polyglot}
                                closeAll={this.closeAll}
                                handleGraphItemClick={this.handleGraphItemClick}
                                toggleSearch={this.toggleSearch}
                                graphDrawer={graphDrawer}
                                searchDrawer={searchDrawer}
                            />
                        ))}
                    </div>
                    <div className={css(styles.last)}>
                        {bottomMenu.map((config, index) => (
                            <MenuItem
                                key={index}
                                config={config}
                                role={role}
                                canBeSearched={canBeSearched}
                                hasGraph={hasGraph}
                                logout={logout}
                                polyglot={polyglot}
                                closeAll={this.closeAll}
                                handleGraphItemClick={this.handleGraphItemClick}
                                toggleSearch={this.toggleSearch}
                                graphDrawer={graphDrawer}
                                searchDrawer={searchDrawer}
                            />
                        ))}
                    </div>
                </nav>
                <Drawer
                    status={graphDrawer}
                    onClose={this.toggleGraph}
                    animationDuration={ANIMATION_DURATION}
                >
                    <GraphSummary closeDrawer={this.toggleGraph} />
                </Drawer>
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
    topMenu: menuPropTypes,
    bottomMenu: menuPropTypes,
    loadMenu: PropTypes.func.isRequired,
    hasFacetFields: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    role: fromUser.getRole(state),
    canBeSearched: fromFields.canBeSearched(state),
    hasGraph: fromFields.getGraphFields(state).length > 0,
    topMenu: fromMenu.getTopMenu(state),
    bottomMenu: fromMenu.getBottomMenu(state),
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
