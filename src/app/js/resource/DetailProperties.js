import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';

import {
    getResourceLastVersion,
} from './';
import {
    getCollectionFields,
    getDocumentFields,
} from '../publication';
import Property from '../lib/Property';

export const DetailPropertiesComponent = ({ resource, collectionFields, documentFields }) => (
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
);

DetailPropertiesComponent.defaultProps = {
    resource: null,
};

DetailPropertiesComponent.propTypes = {
    resource: PropTypes.shape({}),
    collectionFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    documentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
    resource: getResourceLastVersion(state),
    collectionFields: getCollectionFields(state),
    documentFields: getDocumentFields(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPropertiesComponent);
