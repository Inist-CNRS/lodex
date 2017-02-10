import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardText, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    getResourceLastVersion,
} from './';
import {
    getFields,
} from '../publication';
import Card from '../lib/Card';
import Property from '../lib/Property';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { isLoggedIn } from '../user';

export const DetailComponent = ({ resource, fields, isLogged, p: polyglot }) => (
    <Card className="detail">
        <CardHeader title={'Properties'} />
        <CardText>
            {fields.filter(({ cover }) => cover !== 'dataset').map(({ name, scheme }) => (
                <Property name={name} scheme={scheme} value={resource[name]} />
            ))}
        </CardText>
        {
            isLogged ?
                <CardActions>
                    <Link to={{ pathname: '/resource/edit', query: { uri: resource.uri } }}>
                        <FlatButton className="edit-resource" label={polyglot.t('edit')} primary />
                    </Link>
                    <Link to={{ pathname: '/resource/hide', query: { uri: resource.uri } }}>
                        <FlatButton className="hide-resource" label={polyglot.t('hide')} primary />
                    </Link>
                </CardActions>
            :
                null
        }
    </Card>
);

DetailComponent.defaultProps = {
    resource: null,
};

DetailComponent.propTypes = {
    resource: PropTypes.shape({}),
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLogged: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
    fields: getFields(state),
    isLogged: isLoggedIn(state),
});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DetailComponent);
