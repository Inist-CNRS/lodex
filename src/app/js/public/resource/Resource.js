import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { Link } from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {
    fromResource,
    fromPublication,
    fromCharacteristic,
} from '../selectors';
import Card from '../../lib/Card';
import Detail from './Detail';
import RemovedDetail from './RemovedDetail';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Loading from '../../lib/Loading';

export const getDetail = (mode) => {
    switch (mode) {
    case 'removed':
        return <RemovedDetail />;
    case 'view':
    default:
        return <Detail />;
    }
};

export const ResourceComponent = ({
    resource,
    datasetTitleKey,
    characteristics,
    loading,
    mode,
    p: polyglot,
}) => {
    if (loading) {
        return (
            <Loading className="resource">{polyglot.t('loading_resource')}</Loading>
        );
    }

    const backToListLabel = (datasetTitleKey && characteristics[datasetTitleKey]) || polyglot.t('back_to_list');
    const backToListButton = (
        <FlatButton
            containerElement={<Link to="/home" />}
            label={backToListLabel}
            icon={<HomeIcon />}
        />
    );

    if (!resource) {
        return (
            <div className="not-found">
                <Card>
                    <CardActions>
                        {backToListButton}
                    </CardActions>
                </Card>
                <Card>
                    <CardText>
                        <h1>
                            {polyglot.t('not_found')}
                        </h1>
                    </CardText>
                </Card>
            </div>
        );
    }
    return (
        <div className="resource">
            <Card>
                <CardActions>
                    {backToListButton}
                </CardActions>
            </Card>
            {getDetail(mode)}
        </div>
    );
};

ResourceComponent.defaultProps = {
    mode: 'view',
    resource: null,
    datasetTitle: null,
    datasetTitleKey: null,
    titleKey: null,
};

ResourceComponent.propTypes = {
    mode: PropTypes.oneOf(['view', 'removed']).isRequired,
    resource: PropTypes.shape({ uri: PropTypes.string.isRequired }),
    p: polyglotPropTypes.isRequired,
    datasetTitleKey: PropTypes.string,
    characteristics: PropTypes.shape({}),
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    characteristics: fromCharacteristic.getCharacteristicsAsResource(state),
    datasetTitleKey: fromPublication.getDatasetTitleFieldName(state),
    fields: fromPublication.getFields(state),
    loading: fromResource.isLoading(state),
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ResourceComponent);
