import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    fromPublication,
} from './selectors';
import {
    field as fieldPropTypes,
} from '../propTypes';
import Property from './Property';
import getFieldClassName from '../lib/getFieldClassName';

const styles = {
    container: {
        paddingLeft: '2rem',
        marginLeft: '2rem',
        marginTop: '2rem',
        borderLeft: '5px dotted rgb(224, 224, 224)',
        display: 'flex',
        flexDirection: 'column',
    },
    property: {
        paddingTop: '1rem',
        paddingBottom: '1rem',
    },
};

export const CompositePropertyComponent = ({
    compositeFields,
    field,
    isSaving,
    onSaveProperty,
    resource,
}) => {
    if (!compositeFields.length) {
        return null;
    }

    return (
        <div style={styles.container}>
            {compositeFields.map(f => (
                <Property
                    className={`compose_${getFieldClassName(field)}`}
                    key={f.name}
                    field={f}
                    isSaving={isSaving}
                    resource={resource}
                    onSaveProperty={onSaveProperty}
                    style={styles.property}
                />
            ))}
        </div>
    );
};

CompositePropertyComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    isSaving: PropTypes.bool.isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    onSaveProperty: PropTypes.func.isRequired,
    resource: PropTypes.shape({}).isRequired,
};

CompositePropertyComponent.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { field, resource }) => ({
    resource,
    compositeFields: fromPublication.getCompositeFieldsByField(state, field),
});

const CompositeProperty = connect(mapStateToProps)(CompositePropertyComponent);

export default CompositeProperty;
