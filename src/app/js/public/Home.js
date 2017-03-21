import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Tabs, Tab } from 'material-ui/Tabs';
import { cyan500 } from 'material-ui/styles/colors';

import { polyglot as polyglotPropTypes } from '../propTypes';
import {
    loadPublication as loadPublicationAction,
} from './publication';

import { fromPublication } from './selectors';

import Alert from '../lib/Alert';
import Card from '../lib/Card';
import Loading from '../lib/Loading';
import Dataset from './dataset/Dataset';
import DatasetCharacteristics from './characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import Toolbar from './Toolbar';
import AppliedFacetList from './facet/AppliedFacetList';
import Ontology from './Ontology';

const styles = {
    tab: {
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgb(224, 224, 224)',
        color: 'black',
    },
    tabButton: {
        color: cyan500,
    },
};

export class HomeComponent extends Component {
    static defaultProps = {
        error: null,
    }

    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        loadPublication: PropTypes.func.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    componentWillMount() {
        this.props.loadPublication();
    }

    render() {
        const {
            error,
            hasPublishedDataset,
            loading,
            p: polyglot,
        } = this.props;

        if (loading) {
            return (
                <Loading>{polyglot.t('loading')}</Loading>
            );
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
                    <Toolbar />
                    <AppliedFacetList />
                    <DatasetCharacteristics />
                    <Card>
                        <Tabs tabItemContainerStyle={styles.tab}>
                            <Tab
                                label={polyglot.t('resources')}
                                style={styles.tabButton}
                            >
                                <Dataset />
                            </Tab>
                            <Tab buttonStyle={styles.tabButton} label={polyglot.t('resource_share_export')} />
                            <Tab buttonStyle={styles.tabButton} label={polyglot.t('resource_ontology')}>
                                <Ontology />
                            </Tab>
                        </Tabs>
                    </Card>
                </div>
            );
        }

        return <NoDataset />;
    }
}

const mapStateToProps = state => ({
    error: fromPublication.getPublicationError(state),
    loading: fromPublication.isPublicationLoading(state),
    hasPublishedDataset: fromPublication.hasPublishedDataset(state),
});

const mapDispatchToProps = ({
    loadPublication: loadPublicationAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(HomeComponent);
