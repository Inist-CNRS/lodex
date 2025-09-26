import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { push } from 'redux-first-history';
import { Helmet } from 'react-helmet';
import { Card } from '@mui/material';

import { polyglot as polyglotPropTypes } from '../propTypes';
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

export class HomeComponent extends Component {
    static defaultProps = {
        error: null,
        title: null,
        description: null,
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
        title: PropTypes.string,
        description: PropTypes.string,
        tenant: PropTypes.string,
    };

    UNSAFE_componentWillMount() {
        // @ts-expect-error TS2339
        this.props.preLoadPublication();
        // @ts-expect-error TS2339
        this.props.preLoadDatasetPage();
        // @ts-expect-error TS2339
        this.props.preLoadExporters();
    }

    render() {
        const {
            // @ts-expect-error TS2339
            error,
            // @ts-expect-error TS2339
            hasPublishedDataset,
            // @ts-expect-error TS2339
            loading,
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            title,
            // @ts-expect-error TS2339
            description,
            // @ts-expect-error TS2339
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
        // @ts-expect-error TS2339
        fromCharacteristic.getCharacteristicsAsResource(state);
    // @ts-expect-error TS2339
    const titleKey = fromFields.getDatasetTitleFieldName(state);
    // @ts-expect-error TS2339
    const descriptionKey = fromFields.getDatasetDescriptionFieldName(state);
    const title = titleKey && characteristics[titleKey];
    const description = descriptionKey && characteristics[descriptionKey];

    return {
        // @ts-expect-error TS2339
        error: fromFields.getError(state),
        // @ts-expect-error TS2339
        loading: fromFields.isLoading(state),
        // @ts-expect-error TS2339
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
)(HomeComponent);
