import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { preLoadPublication as preLoadPublicationAction } from '../fields';
import { fromFields } from '../sharedSelectors';
import getTitle from '../lib/getTitle';

import Alert from '../lib/components/Alert';
import Card from '../lib/components/Card';
import Loading from '../lib/components/Loading';
import Dataset from './dataset/Dataset';
import DatasetCharacteristics from './characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import Toolbar from './Toolbar';
import AppliedFacetList from './facet/AppliedFacetList';
import Version from './Version';
import { preLoadDatasetPage } from './dataset';
import { preLoadExporters } from './export';

export class HomeComponent extends Component {
    static defaultProps = {
        error: null,
        sharingTitle: null,
    };

    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        preLoadPublication: PropTypes.func.isRequired,
        preLoadDatasetPage: PropTypes.func.isRequired,
        preLoadExporters: PropTypes.func.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        navigateTo: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        selectedTab: PropTypes.string.isRequired,
        sharingTitle: PropTypes.string,
    };

    componentWillMount() {
        this.props.preLoadPublication();
        this.props.preLoadDatasetPage();
        this.props.preLoadExporters();
    }

    handleTabChange = value => {
        this.props.navigateTo(`/home/${value}`);
    };

    render() {
        const { error, hasPublishedDataset, loading, p: polyglot } = this.props;

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
                        <Toolbar />
                        <AppliedFacetList />
                        <Dataset />
                        <Version />
                    </div>
                </div>
            );
        }

        return <NoDataset />;
    }
}

const mapStateToProps = state => ({
    error: fromFields.getError(state),
    loading: fromFields.isLoading(state),
    hasPublishedDataset: fromFields.hasPublishedDataset(state),
});

const mapDispatchToProps = {
    preLoadPublication: preLoadPublicationAction,
    preLoadDatasetPage,
    preLoadExporters,
    navigateTo: push,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    HomeComponent,
);
