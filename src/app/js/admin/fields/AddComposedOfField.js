import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import {
    addComposedOfField,
    removeComposedOfField,
} from './';

export const AddComposedOfComponent = ({ onAdd, onRemove }) => (
    <div>
        <FlatButton onClick={onAdd} label="+" />
        <FlatButton onClick={onRemove} label="-" />
    </div>
);


AddComposedOfComponent.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    onAdd: addComposedOfField,
    onRemove: removeComposedOfField,
};

export default connect(null, mapDispatchToProps)(AddComposedOfComponent);
