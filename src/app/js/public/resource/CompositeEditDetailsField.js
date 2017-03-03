import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';

import EditDetailsField from './EditDetailsField';
import {
    fromPublication,
} from '../selectors';
import {
    field as fieldPropTypes,
} from '../../propTypes';

const style = {
    list: {
        paddingLeft: '25px',
    },
};

export const CompositeEditDetailsFieldComponent = ({ label, compositeFields }) => (
    <div>
        <Subheader>{label}</Subheader>
        <div style={style.list}>
            {
                compositeFields.map(f => (
                    <EditDetailsField
                        key={f.name}
                        field={f}
                    />
                ))
            }
        </div>
    </div>
);

CompositeEditDetailsFieldComponent.propTypes = {
    label: PropTypes.string.isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

CompositeEditDetailsFieldComponent.defaultProps = {
    completedField: null,
};

const mapStateToProps = (state, { field }) => ({
    compositeFields: fromPublication.getCompositeFields(state, field),
});

const CompositeEditDetailsField = connect(mapStateToProps)(CompositeEditDetailsFieldComponent);

export default CompositeEditDetailsField;
