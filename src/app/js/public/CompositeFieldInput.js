import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';

import FieldInput from './FieldInput';
import { fromFields } from '../sharedSelectors';
import {
    field as fieldPropTypes,
} from '../propTypes';

const style = {
    list: {
        paddingLeft: '25px',
    },
};

export const CompositeFieldInputComponent = ({ label, compositeFields }) => (
    <div>
        <Subheader>{label}</Subheader>
        <div style={style.list}>
            {
                compositeFields.map(f => (
                    <FieldInput
                        key={f.name}
                        field={f}
                    />
                ))
            }
        </div>
    </div>
);

CompositeFieldInputComponent.propTypes = {
    label: PropTypes.string.isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

CompositeFieldInputComponent.defaultProps = {
    completedField: null,
};

const mapStateToProps = (state, { field }) => ({
    compositeFields: fromFields.getCompositeFieldsByField(state, field),
});

const CompositeEditDetailsField = connect(mapStateToProps)(CompositeFieldInputComponent);

export default CompositeEditDetailsField;
