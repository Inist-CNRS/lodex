import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Add as AddNewIcon } from '@mui/icons-material';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import { useParams } from 'react-router';

import { addField } from '../../fields';
import { fromFields } from '../../sharedSelectors';
import { useTranslate } from '../../i18n/I18NContext';

// @ts-expect-error TS7031
export const AddFieldButtonComponent = ({ onAddNewField, isFieldsLoading }) => {
    const { translate } = useTranslate();
    const { filter } = useParams();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                onAddNewField({ scope: filter });
            }}
            disabled={isFieldsLoading}
            startIcon={<AddNewIcon />}
        >
            {translate('new_field')}
        </Button>
    );
};

AddFieldButtonComponent.propTypes = {
    onAddNewField: PropTypes.func.isRequired,
    isFieldsLoading: PropTypes.bool,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    isFieldsLoading: fromFields.isLoading(state),
});

const mapDispatchToProps = {
    onAddNewField: addField,
};

export const AddFieldButton = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddFieldButtonComponent);
