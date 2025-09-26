import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { compose } from 'recompose';

import { Stack, Typography } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
import FieldAnnotationKindAdditionInput from './FieldAnnotationKindAdditionInput';
import FieldAnnotationKindCorrectionInput from './FieldAnnotationKindCorrectionInput';
import FieldAnnotationKindRemovalInput from './FieldAnnotationKindRemovalInput';

// @ts-expect-error TS7031
export function FieldAnnotationKind({ isFieldAnnotable }) {
    const { translate } = useTranslate();

    if (!isFieldAnnotable) {
        return null;
    }

    return (
        <Stack gap={1}>
            <Typography
                variant="h2"
                sx={{
                    fontSize: '1rem',
                }}
            >
                {translate('field_annotation_kind')}
            </Typography>
            <FieldAnnotationKindCorrectionInput />
            <FieldAnnotationKindAdditionInput />
            <FieldAnnotationKindRemovalInput />
        </Stack>
    );
}

FieldAnnotationKind.propTypes = {
    isFieldAnnotable: PropTypes.bool.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        isFieldAnnotable: state.form.field.values.annotable,
    };
};

export default compose(connect(mapStateToProps))(FieldAnnotationKind);
