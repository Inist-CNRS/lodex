import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Tabs, Tab } from 'material-ui/Tabs';
import { push } from 'react-router-redux';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { loadPublication as loadPublicationAction } from '../fields';
import { fromCharacteristic } from './selectors';
import { fromFields } from '../sharedSelectors';

import Alert from '../lib/components/Alert';
import Card from '../lib/components/Card';
import Loading from '../lib/components/Loading';
import Dataset from './dataset/Dataset';
import DatasetCharacteristics from './characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import Toolbar from './Toolbar';
import AppliedFacetList from './facet/AppliedFacetList';
import Ontology from '../fields/ontology/Ontology';
import Export from './Export';
import Share from './Share';
import ShareLink from './ShareLink';

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
    }

    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        loadPublication: PropTypes.func.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        navigateTo: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        selectedTab: PropTypes.string.isRequired,
        sharingTitle: PropTypes.string,
        sharingUri: PropTypes.string.isRequired,
    }

    componentWillMount() {
        this.props.loadPublication();
    }

    handleTabChange = (value) => {
        this.props.navigateTo(`/home/${value}`);
    }

    render() {
        const {
            error,
            hasPublishedDataset,
            loading,
            p: polyglot,
            selectedTab,
            sharingTitle,
            sharingUri,
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
                        <Tabs
                            inkBarStyle={styles.inkBarStyle}
                            value={selectedTab}
                            onChange={this.handleTabChange}
                            tabItemContainerStyle={styles.tab}
                        >
                            <Tab
                                className="tab-dataset-resources"
                                label={polyglot.t('resources')}
                                style={styles.tabButton}
                                value="dataset"
                            >
                                <Dataset />
                            </Tab>
                            <Tab
                                className="tab-dataset-export"
                                buttonStyle={styles.tabButton}
                                label={polyglot.t('share_export')}
                                value="export"
                            >
                                <Export />
                                <ShareLink title={polyglot.t('dataset_share_link')} uri={sharingUri} />
                                <Share uri={sharingUri} title={sharingTitle} />
                            </Tab>
                            <Tab
                                className="tab-dataset-ontology"
                                buttonStyle={styles.tabButton}
                                label={polyglot.t('ontology')}
                                value="ontology"
                            >
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

const mapStateToProps = (state, { params: { tab = 'dataset' } }) => {
    const titleFieldName = fromFields.getDatasetTitleFieldName(state);
    const fields = fromFields.getDatasetFields(state);
    const characteristics = fromCharacteristic.getCharacteristics(state, fields);
    let sharingTitle;

    if (titleFieldName) {
        sharingTitle = characteristics.find(f => f.name === titleFieldName).value;
    }
    return ({
        selectedTab: tab,
        sharingTitle,
        sharingUri: window.location.toString(),
        error: fromFields.getError(state),
        loading: fromFields.isLoading(state),
        hasPublishedDataset: fromFields.hasPublishedDataset(state),
    });
};

const mapDispatchToProps = ({
    loadPublication: loadPublicationAction,
    navigateTo: push,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(HomeComponent);
