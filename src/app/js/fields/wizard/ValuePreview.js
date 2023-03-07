import React from 'react';
import translate from 'redux-polyglot/translate';
import PreviewIcon from '@mui/icons-material/Preview';
import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fromFieldPreview } from '../../admin/selectors';
import { getFieldFormData } from '../selectors';
import { SCOPE_DATASET } from '../../../../common/scope';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import customTheme from '../../../custom/customTheme';

const ValuePreview = ({ lines, editedField, p: polyglot }) => {
    return (
        <Box
            id="value-preview"
            sx={{
                background: customTheme.palette.neutralDark.veryLight,
                padding: 2,
                borderRadius: 2,
            }}
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={4}
            >
                <PreviewIcon mr={1} />
                <Typography variant="h6">
                    {polyglot.t('value_preview_title')}
                </Typography>
            </Box>

            <Box textAlign={'center'} mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {editedField.label}
                </Typography>
            </Box>
            <Box mb={4}>
                {lines.length > 0 &&
                    lines?.map((line, index) => (
                        <Box key={index} mb={3}>
                            <Typography
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                }}
                                title={JSON.stringify(line[editedField.name])}
                            >
                                {JSON.stringify(line[editedField.name])}
                            </Typography>
                        </Box>
                    ))}
            </Box>
            <Box mb={1}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {polyglot.t('value_preview_description')}
                </Typography>
            </Box>
        </Box>
    );
};

const mapStateToProps = (state, { scope }) => {
    const editedField = getFieldFormData(state);
    let lines = fromFieldPreview.getFieldPreview(state);

    if (lines.length > 0) {
        lines = scope === SCOPE_DATASET ? [lines[0]] : lines;
    }
    return {
        lines,
        editedField: editedField ? editedField : [],
    };
};

ValuePreview.propTypes = {
    lines: PropTypes.array.isRequired,
    editedField: PropTypes.object,
    p: polyglotPropTypes.isRequired,
};

export default compose(connect(mapStateToProps), translate)(ValuePreview);
