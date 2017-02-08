import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardHeader, CardText } from 'material-ui/Card';

import {
    getResource,
} from './';
import {
    getFields,
} from '../publication';
import Card from '../lib/Card';
import Property from '../lib/Property';

export const DetailComponent = ({ resource, fields }) => (
    <Card>
        <CardHeader title={'Properties'} />
        <CardText>
            {fields.filter(({ cover }) => cover !== 'dataset').map(({ name, scheme }) => (
                <Property name={name} scheme={scheme} value={resource[name]} />
            ))}
        </CardText>
    </Card>
);

DetailComponent.defaultProps = {
    resource: null,
};

DetailComponent.propTypes = {
    resource: PropTypes.shape({}),
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    resource: getResource(state),
    fields: getFields(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DetailComponent);
