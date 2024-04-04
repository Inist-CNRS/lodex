import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Add as AddNewIcon } from '@mui/icons-material';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { addField } from '../../fields';
import { fromFields } from '../../sharedSelectors';

export const AddFieldButtonComponent = ({
    onAddNewField,
    p: polyglot,
    isFieldsLoading,
}) => {
    const { filter } = useParams();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                onAddNewField({ scope: filter });
            }}
            className="btn-add-free-field"
            sx={{
                marginLeft: '10px',
            }}
            disabled={isFieldsLoading}
        >
            <AddNewIcon
                sx={{
                    marginRight: '10px',
                }}
            />
            {polyglot.t('new_field')}
        </Button>
    );
};

AddFieldButtonComponent.propTypes = {
    onAddNewField: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    isFieldsLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isFieldsLoading: fromFields.isLoading(state),
});

const mapDispatchToProps = {
    onAddNewField: addField,
};

export const AddFieldButton = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(AddFieldButtonComponent);
