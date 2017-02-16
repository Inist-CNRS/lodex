import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getInvalidFields } from '../validation';
import ValidationField from './ValidationField';
import { editField as editFieldAction } from '../fields';
import { validationField as validationFieldPropType } from '../../propTypes';

const styles = {
    list: {
        listStyle: 'none',
    },
};

const ValidationComponent = ({ editField, fields }) => (
    <ul style={styles.list}>
        {fields.map(field => <ValidationField field={field} onEditField={editField} />)}
    </ul>
);


ValidationComponent.propTypes = {
    fields: PropTypes.arrayOf(validationFieldPropType).isRequired,
    editField: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    fields: getInvalidFields(state),
});

const mapDispatchToProps = { editField: editFieldAction };

export default connect(mapStateToProps, mapDispatchToProps)(ValidationComponent);
