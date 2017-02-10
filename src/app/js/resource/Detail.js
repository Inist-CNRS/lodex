import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardText, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    getResourceLastVersion,
} from './';
import {
    getCollectionFields,
    getDocumentFields,
} from '../publication';
import Card from '../lib/Card';
import Property from '../lib/Property';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { isLoggedIn } from '../user';

export const DetailComponent = ({ resource, collectionFields, documentFields, isLogged, p: polyglot }) => (
    <Card className="detail">
        <CardHeader title={'Properties'} />
        <CardText>
            {collectionFields.map(({ name, scheme }) => (
                <Property name={name} scheme={scheme} value={resource[name]} />
            ))}
            {documentFields.filter(({ name }) => !!resource[name]).map(({ name, scheme }) => (
                <Property
                    name={name}
                    scheme={scheme}
                    value={resource[name]}
                />
            ))}
        </CardText>
        <CardActions>
            {
                (isLogged ? ['edit', 'hide', 'add-field'] : ['add-field'])
                .map(name => (
                    <Link to={{ pathname: `/resource/${name}`, query: { uri: resource.uri } }}>
                        <FlatButton className={`${name}-resource`} label={polyglot.t(name)} primary />
                    </Link>
                ))
            }
        </CardActions>
    </Card>
);

DetailComponent.defaultProps = {
    resource: null,
};

DetailComponent.propTypes = {
    resource: PropTypes.shape({}),
    collectionFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    documentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLogged: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
    collectionFields: getCollectionFields(state),
    documentFields: getDocumentFields(state),
    isLogged: isLoggedIn(state),
});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DetailComponent);
