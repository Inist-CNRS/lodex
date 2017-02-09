import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardText, CardActions } from 'material-ui/Card';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import {
    getResourceLastVersion,
} from './';
import {
    getFields,
} from '../publication';
import Card from '../lib/Card';
import Property from '../lib/Property';

export const DetailComponent = ({ resource, fields }) => {
    if (resource.removedAt) {
        return (
            <Card>
                <CardText>
                    <p>This resource was removed</p>
                    <p>{resource.reason}</p>
                </CardText>
            </Card>
        );
    }
    return (
        <Card className="detail">
            <CardHeader title={'Properties'} />
            <CardText>
                {fields.filter(({ cover }) => cover !== 'dataset').map(({ name, scheme }) => (
                    <Property name={name} scheme={scheme} value={resource[name]} />
                ))}
            </CardText>
            <CardActions>
                <Link to={{ pathname: '/resource/edit', query: { uri: resource.uri } }}>
                    <FlatButton className="edit-resource" label={'Edit'} primary />
                </Link>
                <Link to={{ pathname: '/resource/hide', query: { uri: resource.uri } }}>
                    <FlatButton className="remove-resource" label={'Hide'} primary />
                </Link>
            </CardActions>
        </Card>
    );
};


DetailComponent.defaultProps = {
    resource: null,
};

DetailComponent.propTypes = {
    resource: PropTypes.shape({}),
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
    fields: getFields(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DetailComponent);
