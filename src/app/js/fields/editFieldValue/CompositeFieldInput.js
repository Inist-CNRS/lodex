import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';

import FieldInput from './FieldInput';
import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';

const style = {
    list: {
        paddingLeft: '25px',
    },
};

export const CompositeFieldInputComponent = ({
    label,
    rootField,
    compositeFields,
}) => (
    <div>
        <Subheader>{label}</Subheader>
        <FieldInput field={rootField} />
        <div style={style.list}>
            {compositeFields.map(f => (
                <FieldInput key={f.name} field={f} />
            ))}
        </div>
    </div>
);

CompositeFieldInputComponent.propTypes = {
    label: PropTypes.string.isRequired,
    rootField: fieldPropTypes.isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

CompositeFieldInputComponent.defaultProps = {
    compositeFields: null,
};

const mapStateToProps = (state, { field }) => ({
    rootField: {
        ...fromFields.getFieldByName(state, field.name),
        composedOf: null,
    },
    compositeFields: fromFields.getCompositeFieldsByField(state, field),
});

const CompositeEditDetailsField = connect(mapStateToProps)(
    CompositeFieldInputComponent,
);

export default CompositeEditDetailsField;
