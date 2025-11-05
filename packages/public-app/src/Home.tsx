import { useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { Helmet } from 'react-helmet';
import { Card } from '@mui/material';

import { preLoadPublication as preLoadPublicationAction } from '@lodex/frontend-common/fields/reducer';
import {
    fromFields,
    fromCharacteristic,
} from '@lodex/frontend-common/sharedSelectors';
import Alert from '@lodex/frontend-common/components/Alert';
import Loading from '@lodex/frontend-common/components/Loading';
import DatasetCharacteristics from './characteristics/DatasetCharacteristics';
import NoDataset from './NoDataset';
import getTitle from '@lodex/frontend-common/utils/getTitle';

import { preLoadDatasetPage } from './dataset';
import { preLoadExporters } from './export';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface HomeComponentProps {
    error?: string;
    loading: boolean;
    preLoadPublication(...args: unknown[]): unknown;
    preLoadDatasetPage(...args: unknown[]): unknown;
    preLoadExporters(...args: unknown[]): unknown;
    hasPublishedDataset: boolean;
    navigateTo(...args: unknown[]): unknown;
    title?: string;
    description?: string;
    tenant?: string;
}

export const HomeComponent = ({
    error,
    loading,
    preLoadPublication,
    preLoadDatasetPage,
    preLoadExporters,
    hasPublishedDataset,
    title,
    description,
    tenant,
}: HomeComponentProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        preLoadPublication();
        preLoadDatasetPage();
        preLoadExporters();
    }, [preLoadPublication, preLoadDatasetPage, preLoadExporters]);

    if (loading) {
        return <Loading>{translate('loading')}</Loading>;
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
};

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
    // @ts-expect-error TS2345
)(HomeComponent);
