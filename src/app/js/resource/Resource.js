import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { Link } from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardHeader, CardText } from 'material-ui/Card';

import { getResource, isLoading } from './';
import {
    getFields,
    getDatasetTitle,
    getTitleFieldName,
} from '../publication';
import Card from '../lib/Card';
import Detail from './Detail';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import DatasetCharacteristics from '../dataset/DatasetCharacteristics';
import Loading from '../lib/Loading';

export const ResourceComponent = ({ resource, datasetTitle, titleKey, loading, p: polyglot }) => {
    if (loading) {
        return (
            <Loading className="resource">{polyglot.t('loading_resource')}</Loading>
        );
    }
    if (!resource) {
        return (
            <Card className="not-found">
                <CardText>
                    <Link to="/home">
                        <HomeIcon />
                        {datasetTitle || polyglot.t('back_to_list')}
                    </Link>
                    <h1>{polyglot.t('not_found')}</h1>
                </CardText>
            </Card>
        );
    }
    return (
        <div>
            <Card>
                <CardText>
                    <Link to="/home">
                        <HomeIcon />
                        {datasetTitle || polyglot.t('back_to_list')}
                    </Link>
                    <h1>{titleKey ? resource[titleKey] : resource.uri}</h1>
                </CardText>
            </Card>
            <Detail />
            <DatasetCharacteristics />
        </div>
    );
};

ResourceComponent.defaultProps = {
    resource: null,
    datasetTitle: null,
    titleKey: null,
};

ResourceComponent.propTypes = {
    resource: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
    titleKey: PropTypes.string,
    datasetTitle: PropTypes.string,
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    resource: getResource(state),
    datasetTitle: getDatasetTitle(state),
    titleKey: getTitleFieldName(state),
    fields: getFields(state),
    loading: isLoading(state),
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ResourceComponent);
