import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

import { fromResource } from '../selectors';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Card from '../../lib/components/Card';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Loading from '../../lib/components/Loading';
import { preLoadResource } from './';
import { preLoadPublication } from '../../fields';
import Link from '../../lib/components/Link';

export class ResourceComponent extends Component {
    UNSAFE_componentWillMount() {
        this.props.preLoadResource();
        this.props.preLoadPublication();
    }

    componentDidUpdate(prevProps) {
        if (
            !isEqual(
                get(this.props, 'match.params', {}),
                get(prevProps, 'match.params', {}),
            )
        ) {
            this.props.preLoadResource();
        }
    }

    render() {
        const {
            resource,
            datasetTitleKey,
            characteristics,
            loading,
            removed,
            p: polyglot,
        } = this.props;

        if (loading) {
            return (
                <Loading className="resource">
                    {polyglot.t('loading_resource')}
                </Loading>
            );
        }

        const backToListLabel =
            (datasetTitleKey && characteristics[datasetTitleKey]) ||
            polyglot.t('back_to_list');
        const backToListButton = (
            <FlatButton
                className="btn-back-to-list"
                containerElement={<Link to="/graph" />}
                label={backToListLabel}
                icon={<HomeIcon />}
            />
        );

        if (!resource) {
            return (
                <div className="not-found">
                    <Card>
                        <CardActions>{backToListButton}</CardActions>
                    </Card>
                    <Card>
                        <CardText>
                            <h1>{polyglot.t('not_found')}</h1>
                        </CardText>
                    </Card>
                </div>
            );
        }
        return (
            <div className="resource">
                {removed && <RemovedDetail />}
                {!removed && <Detail backToListLabel={backToListLabel} />}
            </div>
        );
    }
}

ResourceComponent.defaultProps = {
    characteristics: null,
    resource: null,
    datasetTitle: null,
    datasetTitleKey: null,
    titleKey: null,
};

ResourceComponent.propTypes = {
    characteristics: PropTypes.shape({}),
    resource: PropTypes.shape({ uri: PropTypes.string.isRequired }),
    p: polyglotPropTypes.isRequired,
    datasetTitleKey: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    removed: PropTypes.bool.isRequired,
    preLoadResource: PropTypes.func.isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            uri: PropTypes.string,
        }),
    }).isRequired,
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    removed: fromResource.hasBeenRemoved(state),
    characteristics: fromCharacteristic.getCharacteristicsAsResource(state),
    datasetTitleKey: fromFields.getDatasetTitleFieldName(state),
    fields: fromFields.getFields(state),
    loading: fromResource.isLoading(state),
});

const mapDispatchToProps = {
    preLoadResource,
    preLoadPublication,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    translate,
)(ResourceComponent);
