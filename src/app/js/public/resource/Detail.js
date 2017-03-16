import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';
import memoize from 'lodash.memoize';

import {
    fromResource,
    fromPublication,
} from '../selectors';
import Property from '../Property';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: memoize((index, total) => ({
        borderBottom: index < total - 1 ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingBottom: index < total - 1 ? '3rem' : 0,
        paddingTop: '2rem',
    })),
};

export const DetailComponent = ({ resource, collectionFields, documentFields }) => (
    <CardText className="detail-properties" style={styles.container}>
        {collectionFields.map((field, index) => (
            <Property
                key={field.name}
                resource={resource}
                field={field}
                style={styles.item(index, collectionFields.length)}
            />
        ))}
        {documentFields.filter(({ name }) => !!resource[name]).map((field, index) => (
            <Property
                key={field.name}
                resource={resource}
                field={field}
                style={styles.item(index, documentFields.length)}
            />
        ))}
    </CardText>
);

DetailComponent.defaultProps = {
    resource: null,
};

DetailComponent.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailComponent);
