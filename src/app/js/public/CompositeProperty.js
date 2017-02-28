import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
    fromPublication,
} from './selectors';
import {
    field as fieldPropTypes,
} from '../propTypes';
import Format from './Format';

const PropertyComponent = ({
    field,
    compositeFields,
    fields,
    resource,
}) => (
    <div>
        {compositeFields.map((f, index) => (
            <span>
                <Format
                    className="property_value"
                    field={f}
                    fields={fields}
                    resource={resource}
                />
                {
                    index !== compositeFields.length - 1 ?
                        <span>{field.composedOf.separator}</span> : null
                }
            </span>
        ))}
    </div>
);

PropertyComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.shape({}).isRequired,
};

PropertyComponent.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { field, resource }) => ({
    resource,
    fields: fromPublication.getCollectionFields(state),
    compositeFields: fromPublication.getCompositeFields(state, field),
});

const Property = connect(mapStateToProps)(PropertyComponent);

export default Property;
