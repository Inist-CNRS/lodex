import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';
import { Link } from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';

import { getResource } from './';
import { getFields, getTitle } from '../publication';
import Card from '../lib/Card';
import Detail from './Detail';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import DataCharacteristics from '../dataset/DatasetCharacteristics';

export const ResourceComponent = ({ resource, title, p: polyglot }) => {
    if (!resource) {
        return (
            <Card>
                <Link to="/home">
                    <HomeIcon />
                    {title || polyglot.t('back_to_list')}
                </Link>
                <h1>{polyglot.t('not_found')}</h1>
            </Card>
        );
    }
    return (
        <div>
            <Card>
                <Link to="/home">
                    <HomeIcon />
                    {title || polyglot.t('back_to_list')}
                </Link>
            </Card>
            <Detail />
            <DataCharacteristics />
        </div>
    );
};

ResourceComponent.defaultProps = {
    resource: null,
    title: null,
};

ResourceComponent.propTypes = {
    resource: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
    title: PropTypes.string,
};

const mapStateToProps = state => ({
    resource: getResource(state),
    title: getTitle(state),
    fields: getFields(state),
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ResourceComponent);
