import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    fromResource,
} from '../../selectors';
import Card from '../../lib/Card';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { isLoggedIn } from '../../user';
import DetailProperties from './DetailProperties';

export const DetailComponent = ({ resource, isLogged, p: polyglot }) => (
    <Card className="detail">
        <CardHeader title={'Properties'} />
        <DetailProperties />
        <CardActions>
            {
                (isLogged ? ['edit', 'hide', 'add-field'] : ['add-field'])
                .map(name => (
                    <Link key={name} to={{ pathname: `/resource/${name}`, query: { uri: resource.uri } }}>
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
    resource: PropTypes.shape({
        uri: PropTypes.string.isRequired,
    }),
    isLogged: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    isLogged: isLoggedIn(state),
});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DetailComponent);
