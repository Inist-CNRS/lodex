import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Tabs, Tab } from 'material-ui/Tabs';
import { cyan500 } from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import { CardText } from 'material-ui/Card';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { loadPublication as loadPublicationAction } from './publication';
import { fromPublication, fromCharacteristic } from './selectors';

import Alert from '../lib/Alert';
import Card from '../lib/Card';
import Loading from '../lib/Loading';
import Dataset from './dataset/Dataset';
import DatasetCharacteristics from './characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import Toolbar from './Toolbar';
import AppliedFacetList from './facet/AppliedFacetList';
import Ontology from './Ontology';
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
        color: cyan500,
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
        p: polyglotPropTypes.isRequired,
        sharingTitle: PropTypes.string,
        sharingUri: PropTypes.string.isRequired,
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
                        <Tabs tabItemContainerStyle={styles.tab}>
                            <Tab
                                className="tab-dataset-resources"
                                label={polyglot.t('resources')}
                                style={styles.tabButton}
                            >
                                <Dataset />
                            </Tab>
                            <Tab
                                className="tab-dataset-export"
                                buttonStyle={styles.tabButton}
                                label={polyglot.t('share_export')}
                            >
                                <Subheader>{polyglot.t('export_data')}</Subheader>
                                <Export />
                                <ShareLink title={polyglot.t('dataset_share_link')} uri={sharingUri} />
                                <Subheader>{polyglot.t('share')}</Subheader>
                                <Share uri={sharingUri} title={sharingTitle} />
                            </Tab>
                            <Tab
                                className="tab-dataset-ontology"
                                buttonStyle={styles.tabButton}
                                label={polyglot.t('ontology')}
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

const mapStateToProps = (state) => {
    const titleFieldName = fromPublication.getDatasetTitleFieldName(state);
    const fields = fromPublication.getDatasetFields(state);
    const characteristics = fromCharacteristic.getCharacteristics(state, fields);

    let sharingTitle;

    if (titleFieldName) {
        sharingTitle = characteristics.find(f => f.name === titleFieldName).value;
    }
    return ({
        sharingTitle,
        sharingUri: window.location.toString(),
        error: fromPublication.getPublicationError(state),
        loading: fromPublication.isPublicationLoading(state),
        hasPublishedDataset: fromPublication.hasPublishedDataset(state),
    });
};

const mapDispatchToProps = ({
    loadPublication: loadPublicationAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(HomeComponent);
