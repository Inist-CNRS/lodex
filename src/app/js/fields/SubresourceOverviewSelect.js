import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';
import { TextField, MenuItem, Box } from '@mui/material';
import * as overview from '../../../common/overview';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import { loadField } from '.';
import { fromFields } from '../sharedSelectors';
import fieldApi from '../admin/api/field';
import FieldInternalIcon from './FieldInternalIcon';

export const SubresourceOverviewSelectComponent = ({
    p: polyglot,
    fields,
    loadField,
    subresourceId,
}) => {
    const subresourceTitle = useMemo(() => {
        const subresourceTitleField = fields.find(
            field => field.overview === overview.SUBRESOURCE_TITLE,
        );
        return subresourceTitleField?._id;
    }, [fields]);

    const handleSubresourceTitleChange = async event => {
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
        >
            <MenuItem value={undefined}>{polyglot.t('none')}</MenuItem>
            {fields.map(
                field =>
                    !!field.label && (
                        <MenuItem
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                            key={field._id}
                            value={field._id}
                        >
                            <Box>
                                {field.label}{' '}
                                {field.name ? `(${field.name})` : ''}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {field.internalScopes &&
                                    field.internalScopes.map(internalScope => (
                                        <FieldInternalIcon
                                            key={internalScope}
                                            scope={internalScope}
                                        />
                                    ))}
                                {field.internalName}
                            </Box>
                        </MenuItem>
                    ),
            )}
        </TextField>
    );
};

SubresourceOverviewSelectComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes),
    loadField: PropTypes.func.isRequired,
    subresourceId: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { subresourceId }) => ({
    fields: fromFields.getEditingFields(state, { subresourceId }),
});

const mapDispatchToProps = {
    loadField,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(SubresourceOverviewSelectComponent);
