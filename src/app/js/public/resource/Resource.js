import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { Link } from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardText } from 'material-ui/Card';

import {
    fromResource,
    fromPublication,
    fromCharacteristic,
} from '../../selectors';
import Card from '../../lib/Card';
import Detail from './Detail';
import EditDetail from './EditDetail';
import HideDetail from './HideDetail';
import RemovedDetail from './RemovedDetail';
import AddFieldDetail from './AddFieldDetail';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import DatasetCharacteristics from '../characteristic/DatasetCharacteristics';
import Loading from '../../lib/Loading';

const styles = {
    home: {
        display: 'flex',
        alignItems: 'center',
    },
};

export const getDetail = (mode) => {
    switch (mode) {
    case 'edit':
        return <EditDetail />;
    case 'hide':
        return <HideDetail />;
    case 'removed':
        return <RemovedDetail />;
    case 'add-field':
        return <AddFieldDetail />;
    case 'view':
    default:
        return <Detail />;
    }
};

export const ResourceComponent = ({
    resource,
    titleKey,
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
    if (!resource) {
        return (
            <Card className="not-found">
                <CardText>
                    <Link to="/home" style={styles.home} >
                        <HomeIcon />
                        {(datasetTitleKey && characteristics[datasetTitleKey]) || polyglot.t('back_to_list')}
                    </Link>
                    <h1>{polyglot.t('not_found')}</h1>
                </CardText>
            </Card>
        );
    }
    return (
        <div className="resource">
            <Card>
                <CardText>
                    <Link to="/home" style={styles.home} >
                        <HomeIcon />
                        {(datasetTitleKey && characteristics[datasetTitleKey]) || polyglot.t('back_to_list')}
                    </Link>
                    <h1 className="title">{titleKey ? resource[titleKey] : resource.uri}</h1>
                </CardText>
            </Card>
            {getDetail(mode)}
            <DatasetCharacteristics />
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
    mode: PropTypes.oneOf(['view', 'edit', 'hide']).isRequired,
    resource: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
    titleKey: PropTypes.string,
    datasetTitleKey: PropTypes.string,
    characteristics: PropTypes.shape({}),
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    characteristics: fromCharacteristic.getCharacteristics(state),
    datasetTitleKey: fromPublication.getDatasetTitleFieldName(state),
    titleKey: fromPublication.getTitleFieldName(state),
    fields: fromPublication.getFields(state),
    loading: fromResource.isLoading(state),
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ResourceComponent);
