import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import {
    loadPublication as loadPublicationAction,
    hasPublishedDataset as selectHasPublishedDataset,
} from '../publication';

import Dataset from '../dataset/Dataset';
import NoDataset from '../publication/NoDataset';

const styles = {
    container: {
        marginTop: '0.5rem',
    },
};

export class HomeComponent extends Component {
    static propTypes = {
        error: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        loadPublication: PropTypes.func.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
    }

    componentWillMount() {
        this.props.loadPublication();
    }

    render() {
        const {
            error,
            hasPublishedDataset,
            loading,
        } = this.props;

        if (loading) {
            return (
                <CircularProgress size={80} thickness={5} />
            );
        }

        if (error) {
            return (
                <h2>{error}</h2>
            );
        }

        if (hasPublishedDataset) {
            return (
                <div>
                    <div style={styles.container}>
                        <Dataset />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div style={styles.container}>
                    <NoDataset />
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
