// @ts-expect-error TS6133
import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
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

interface SubresourceOverviewSelectComponentProps {
    p: unknown;
    fields?: unknown[];
    loadField(...args: unknown[]): unknown;
    subresourceId: string;
}

export const SubresourceOverviewSelectComponent = ({
    p: polyglot,

    fields,

    loadField,

    subresourceId
}: SubresourceOverviewSelectComponentProps) => {
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { subresourceId }) => ({
    fields: fromFields.getEditingFields(state, { subresourceId }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(SubresourceOverviewSelectComponent);
