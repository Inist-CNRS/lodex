import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';

import {
    fromResource,
    fromPublication,
} from '../selectors';
import Property from '../Property';

export const DetailPropertiesComponent = ({ resource, collectionFields, documentFields }) => (
    <CardText className="detail-properties">
        {collectionFields.map(field => (
            <Property key={field.name} resource={resource} field={field} />
        ))}
        {documentFields.filter(({ name }) => !!resource[name]).map(field => (
            <Property key={field.name} resource={resource} field={field} />
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
    resource: fromResource.getResourceLastVersion(state),
    collectionFields: fromPublication.getRootCollectionFields(state),
    documentFields: fromPublication.getDocumentFields(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPropertiesComponent);
