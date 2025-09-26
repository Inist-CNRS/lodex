import React, { useMemo } from 'react';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, MenuItem } from '@mui/material';
import * as overview from '../../../common/overview';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import { loadField } from '.';
import { fromFields } from '../sharedSelectors';
import fieldApi from '../admin/api/field';
import FieldRepresentation from './FieldRepresentation';
import { translate } from '../i18n/I18NContext';

export const SubresourceOverviewSelectComponent = ({
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    loadField,
    // @ts-expect-error TS7031
    subresourceId,
}) => {
    const subresourceTitle = useMemo(() => {
        const subresourceTitleField = fields.find(
            // @ts-expect-error TS7006
            (field) => field.overview === overview.SUBRESOURCE_TITLE,
        );
        return subresourceTitleField?._id;
    }, [fields]);

    // @ts-expect-error TS7006
    const handleSubresourceTitleChange = async (event) => {
        const { value: _id } = event.target;
        await fieldApi.patchOverview({
            _id,
            overview: overview.SUBRESOURCE_TITLE,
            subresourceId,
        });
        loadField();
    };

    return (
        <TextField
            select
            value={subresourceTitle || ''}
            label={polyglot.t('overviewSubresourceTitle')}
            onChange={handleSubresourceTitleChange}
            sx={{ minWidth: 220 }}
            SelectProps={{
                renderValue: (option) => (
                    <FieldRepresentation
                        // @ts-expect-error TS7006
                        field={fields.find((f) => f._id === option)}
                        shortMode
                    />
                ),
            }}
        >
            <MenuItem value={undefined}>{polyglot.t('none')}</MenuItem>
            {/*
             // @ts-expect-error TS7006 */}
            {fields.map((field) => (
                <MenuItem
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                    key={field._id}
                    value={field._id}
                >
                    <FieldRepresentation field={field} />
                </MenuItem>
            ))}
        </TextField>
    );
};

SubresourceOverviewSelectComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes),
    loadField: PropTypes.func.isRequired,
    subresourceId: PropTypes.string.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { subresourceId }) => ({
    // @ts-expect-error TS2339
    fields: fromFields.getEditingFields(state, { subresourceId }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(SubresourceOverviewSelectComponent);
