// @ts-expect-error TS6133
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { Helmet } from 'react-helmet';
import { Card } from '@mui/material';

import { preLoadPublication as preLoadPublicationAction } from '../fields';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import Alert from '../lib/components/Alert';
import Loading from '../lib/components/Loading';
import DatasetCharacteristics from '../characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import getTitle from '../lib/getTitle';

import { preLoadDatasetPage } from './dataset';
import { preLoadExporters } from './export';
import { translate } from '../i18n/I18NContext';

interface HomeComponentProps {
    error?: string;
    loading: boolean;
    preLoadPublication(...args: unknown[]): unknown;
    preLoadDatasetPage(...args: unknown[]): unknown;
    preLoadExporters(...args: unknown[]): unknown;
    hasPublishedDataset: boolean;
    navigateTo(...args: unknown[]): unknown;
    p: any;
    title?: string;
    description?: string;
    tenant?: string;
}

export class HomeComponent extends Component<HomeComponentProps> {
    static defaultProps = {
        error: null,
        title: null,
        description: null,
    };

    UNSAFE_componentWillMount() {
        this.props.preLoadPublication();
        this.props.preLoadDatasetPage();
        this.props.preLoadExporters();
    }

    render() {
        const {
            error,
            hasPublishedDataset,
            loading,
            p: polyglot,
            title,
            description,
            tenant,
        } = this.props;

        if (loading) {
            return <Loading>{polyglot.t('loading')}</Loading>;
        }

        if (error) {
            return (
                <Card sx={{ marginTop: '0.5rem' }}>
                    <Alert>{error}</Alert>
                </Card>
            );
        }

        if (hasPublishedDataset) {
            return (
                <div id="home-page">
                    <Helmet>
                        <title>{getTitle(tenant, title || 'LODEX')}</title>
                        <meta name="description" content={description || ''} />
                    </Helmet>
                    <div className="header-dataset-section">
                        <DatasetCharacteristics />
                    </div>
                </div>
            );
        }

        return <NoDataset />;
    }
}

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    const characteristics =
        fromCharacteristic.getCharacteristicsAsResource(state);
    const titleKey = fromFields.getDatasetTitleFieldName(state);
    const descriptionKey = fromFields.getDatasetDescriptionFieldName(state);
    const title = titleKey && characteristics[titleKey];
    const description = descriptionKey && characteristics[descriptionKey];

    return {
        error: fromFields.getError(state),
        loading: fromFields.isLoading(state),
        hasPublishedDataset: fromFields.hasPublishedDataset(state),
        title,
        description,
    };
};

const mapDispatchToProps = {
    preLoadPublication: preLoadPublicationAction,
    preLoadDatasetPage,
    preLoadExporters,
    navigateTo: push,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
    // @ts-expect-error TS2345
)(HomeComponent);
