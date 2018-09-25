import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import Step from './Step';
import FieldFormatInput from '../FieldFormatInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldDisplayInListInput from '../FieldDisplayInListInput';
import FieldDisplayInResourceInput from '../FieldDisplayInResourceInput';
import FieldDisplayInGraphInput from '../FieldDisplayInGraphInput';
import FieldDisplayInHomeInput from '../FieldDisplayInHomeInput';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FIELD_FORM_NAME } from '../';
import { fromFields } from '../../sharedSelectors';
import FieldWidthInput from '../FieldWidthInput';
import { COVERS, COVER_DATASET } from '../../../../common/cover';

export const StepDisplayComponent = ({ cover, p: polyglot, ...props }) => (
    <Step label="field_wizard_step_display" {...props}>
        <FieldDisplayInListInput />
        <FieldDisplayInResourceInput />
        {cover === COVER_DATASET && <FieldDisplayInGraphInput />}
        {cover === COVER_DATASET && <FieldDisplayInHomeInput />}
        <FieldOverviewInput />
        <FieldFormatInput />
        <FieldWidthInput />
    </Step>
);

StepDisplayComponent.propTypes = {
    transformers: PropTypes.arrayOf(PropTypes.object).isRequired,
    cover: PropTypes.oneOf(COVERS),
    format: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => {
    const values = getFormValues(FIELD_FORM_NAME)(state);

    return {
        fields: fromFields.getFields(state),
        format: values && values.format,
        transformers: values ? values.transformers : [],
        cover: values.cover,
    };
};

export default compose(connect(mapStateToProps), translate)(
    StepDisplayComponent,
);
