import React from 'react';
import { connect } from 'react-redux';

import { fromCharacteristic } from '../selectors';
import AddCharacteristicForm from './AddCharacteristicForm';
import {
    NEW_CHARACTERISTIC_FORM_NAME,
} from './';
import DialogButton from '../../lib/DialogButton';

const mapStateToProps = state => ({
    saving: fromCharacteristic.isSaving(state),
    form: <AddCharacteristicForm />,
    formName: NEW_CHARACTERISTIC_FORM_NAME,
    label: 'add_characteristic',
    className: 'add-characteristic',
});

export default connect(mapStateToProps)(DialogButton);
