import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Link } from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { fromResource } from '../selectors';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Card from '../../lib/components/Card';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Loading from '../../lib/components/Loading';

export const ResourceComponent = ({
    resource,
    datasetTitleKey,
    characteristics,
    loading,
    removed,
    p: polyglot,
}) => {
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
};

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
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    removed: fromResource.hasBeenRemoved(state),
    characteristics: fromCharacteristic.getCharacteristicsAsResource(state),
    datasetTitleKey: fromFields.getDatasetTitleFieldName(state),
    fields: fromFields.getFields(state),
    loading: fromResource.isLoading(state),
});

const mapDispatchToProps = {};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    ResourceComponent,
);
