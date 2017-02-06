import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import {
    loadPublication as loadPublicationAction,
    hasPublishedDataset as selectHasPublishedDataset,
} from '../publication';

import Alert from '../lib/Alert';
import Card from '../lib/Card';
import Loading from '../lib/Loading';
import Dataset from '../dataset/Dataset';
import DatasetCharacteristics from '../dataset/DatasetCharacteristics';
import NoDataset from '../publication/NoDataset';

export class HomeComponent extends Component {
    static propTypes = {
        error: PropTypes.string.isRequired,
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
                    <DatasetCharacteristics />
                    <Dataset />
                </div>
            );
        }

        return <NoDataset />;
    }
}

const mapStateToProps = state => ({
    error: state.publication.error,
    loading: state.publication.loading,
    hasPublishedDataset: selectHasPublishedDataset(state),
});

const mapDispatchToProps = ({
    loadPublication: loadPublicationAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(HomeComponent);
