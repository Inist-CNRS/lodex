import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';
import memoize from 'lodash.memoize';

import {
    saveResource as saveResourceAction,
} from './';

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
        display: 'flex',
        flexDirection: 'column',
        borderBottom: index < total - 1 ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingBottom: index < total - 1 ? '3rem' : 0,
        paddingTop: '2rem',
    })),
    property: {
        flexGrow: 2,
    },
};

export const DetailComponent = ({
    collectionFields,
    documentFields,
    handleSaveResource,
    isSaving,
    resource,
}) => (
    <CardText className="detail" style={styles.container}>
        {collectionFields.map((field, index) => (
            <div key={field.name} style={styles.item(index, collectionFields.length)}>
                <Property
                    field={field}
                    isSaving={isSaving}
                    onSaveProperty={handleSaveResource}
                    resource={resource}
                    style={styles.property}
                />
            </div>
        ))}
        {documentFields.filter(({ name }) => !!resource[name]).map((field, index) => (
            <div key={field.name} style={styles.item(index, documentFields.length)}>
                <Property
                    field={field}
                    isSaving={isSaving}
                    onSaveProperty={handleSaveResource}
                    resource={resource}
                    style={styles.property}
                />
            </div>
        ))}
    </CardText>
);

DetailComponent.defaultProps = {
    resource: null,
};

DetailComponent.propTypes = {
    collectionFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    documentFields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSaving: PropTypes.bool.isRequired,
    handleSaveResource: PropTypes.func.isRequired,
    resource: PropTypes.shape({}),
};

const mapStateToProps = state => ({
    resource: fromResource.getResourceLastVersion(state),
    isSaving: fromResource.isSaving(state),
    collectionFields: fromPublication.getRootCollectionFields(state),
    documentFields: fromPublication.getDocumentFields(state),
});

const mapDispatchToProps = { handleSaveResource: saveResourceAction };

export default connect(mapStateToProps, mapDispatchToProps)(DetailComponent);
