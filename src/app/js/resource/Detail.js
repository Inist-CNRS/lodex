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

const styles = {
    container: {
        display: 'flex',
        marginRight: '1rem',
    },
    reason: {
        fontWeight: 'bold',
    },
};

export const DetailComponent = ({ resource, fields, p: polyglot }) => {
    if (resource.removedAt) {
        return (
            <Card>
                <CardText>
                    <p>{polyglot.t('removed_resource_at', { date: moment(resource.removedAt).format('ll') })}</p>
                    <dl style={styles.container}>
                        <dt style={styles.reason}>reason</dt>
                        <dd>
                            {resource.reason.split('\n').map(line => <p>{line}</p>)}
                        </dd>
                    </dl>
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
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
    fields: getFields(state),
});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(DetailComponent);
