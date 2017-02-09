import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { Link } from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';
import { CardText } from 'material-ui/Card';

import { getResourceLastVersion, isLoading } from './';
import {
    getFields,
    getTitleFieldName,
} from '../publication';
import {
    getDatasetTitle,
} from '../characteristic';
import Card from '../lib/Card';
import Detail from './Detail';
import EditDetail from './EditDetail';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import DatasetCharacteristics from '../characteristic/DatasetCharacteristics';
import Loading from '../lib/Loading';

const styles = {
    home: {
        display: 'flex',
        alignItems: 'center',
    },
};

export const ResourceComponent = ({ resource, datasetTitle, titleKey, loading, edit, p: polyglot }) => {
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
                        {datasetTitle || polyglot.t('back_to_list')}
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
                        {datasetTitle || polyglot.t('back_to_list')}
                    </Link>
                    <h1 className="title">{titleKey ? resource[titleKey] : resource.uri}</h1>
                </CardText>
            </Card>
            { edit ?
                <EditDetail />
                :
                <Detail />
            }
            <DatasetCharacteristics />
        </div>
    );
};

ResourceComponent.defaultProps = {
    edit: false,
    resource: null,
    datasetTitle: null,
    titleKey: null,
};

ResourceComponent.propTypes = {
    edit: PropTypes.bool.isRequired,
    resource: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
    titleKey: PropTypes.string,
    datasetTitle: PropTypes.string,
    loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
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
