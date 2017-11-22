import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Tabs, Tab } from 'material-ui/Tabs';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { preLoadPublication as preLoadPublicationAction } from '../fields';
import { fromFields } from '../sharedSelectors';
import getTitle from '../lib/getTitle';

import Alert from '../lib/components/Alert';
import Card from '../lib/components/Card';
import Loading from '../lib/components/Loading';
import Overview from './overview/Overview';
import Dataset from './dataset/Dataset';
import DatasetCharacteristics from './characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import Toolbar from './Toolbar';
import AppliedFacetList from './facet/AppliedFacetList';
import Version from './Version';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    tab: {
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgb(224, 224, 224)',
        color: 'black',
    },
    tabButton: {
        color: 'black',
    },
    inkBarStyle: {
        backgroundColor: 'black',
    },
};

export class HomeComponent extends Component {
    static defaultProps = {
        error: null,
        sharingTitle: null,
    };

    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        preLoadPublication: PropTypes.func.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        navigateTo: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        selectedTab: PropTypes.string.isRequired,
        sharingTitle: PropTypes.string,
        sharingUri: PropTypes.string.isRequired,
    };

    componentWillMount() {
        this.props.preLoadPublication();
    }

    handleTabChange = value => {
        this.props.navigateTo(`/home/${value}`);
    };

    render() {
        const {
            error,
            hasPublishedDataset,
            loading,
            p: polyglot,
            selectedTab,
        } = this.props;

        if (loading) {
            return <Loading>{polyglot.t('loading')}</Loading>;
        }

        if (error) {
            return (
                <Card>
                    <Alert>{error}</Alert>
                </Card>
            );
        }

        if (hasPublishedDataset) {
            return (
                <div>
                    <Helmet>
                        <title>{getTitle()}</title>
                    </Helmet>
                    <div className="header-dataset-section">
                        <DatasetCharacteristics />
                    </div>
                    <div className="main-dataset-section">
                        <Tabs
                            inkBarStyle={styles.inkBarStyle}
                            value={selectedTab}
                            onChange={this.handleTabChange}
                            tabItemContainerStyle={styles.tab}
                        >
                            <Tab
                                className="tab-dataset-overview"
                                label={polyglot.t('overview')}
                                style={styles.tabButton}
                                value="overview"
                            >
                                <Toolbar />
                                <AppliedFacetList />
                                <Overview />
                                <Version />
                            </Tab>
                            <Tab
                                className="tab-dataset-resources"
                                label={polyglot.t('details')}
                                style={styles.tabButton}
                                value="dataset"
                            >
                                <Toolbar />
                                <AppliedFacetList />
                                <Dataset />
                                <Version />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            );
        }

        return <NoDataset />;
    }
}

const mapStateToProps = (state, { params: { tab = 'overview' } }) => ({
    selectedTab: tab,
    error: fromFields.getError(state),
    loading: fromFields.isLoading(state),
    hasPublishedDataset: fromFields.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadPublication: preLoadPublicationAction,
    navigateTo: push,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    HomeComponent,
);
