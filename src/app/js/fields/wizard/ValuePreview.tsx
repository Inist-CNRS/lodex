import { useTranslate } from '../../i18n/I18NContext';
import PreviewIcon from '@mui/icons-material/Preview';
import { useWatch } from 'react-hook-form';

import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { fromFieldPreview } from '../../../../../packages/admin-app/src/selectors';
import { SCOPE_DATASET, type ScopeType } from '@lodex/common';
import { prepareFieldFormData } from '../sagas/saveField.ts';
import type { State } from '../../../../../packages/admin-app/src/reducers.ts';
import type { PreviewLine } from '../types.ts';

const ValuePreview = ({ scope }: { scope?: ScopeType }) => {
    const { translate } = useTranslate();

    const lines: PreviewLine[] = useSelector((state: State) => {
        const lines = fromFieldPreview.getFieldPreview(state);
        if (lines.length > 0) {
            return scope === SCOPE_DATASET ? [lines[0]] : lines;
        }
        return lines;
    });

    const editedField = prepareFieldFormData(useWatch());

    return (
        <Box
            id="value-preview"
            sx={{
                background: 'var(--neutral-dark-very-light)',
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
                {/*
                 // @ts-expect-error TS2769 */}
                <PreviewIcon mr={1} />
                <Typography variant="h6">
                    {translate('value_preview_title')}
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
                                {line[editedField.name] === undefined
                                    ? 'undefined'
                                    : JSON.stringify(
                                          line[editedField.name],
                                          (_k, v) =>
                                              v === undefined
                                                  ? '__undefined'
                                                  : v,
                                      ).replace(/"__undefined"/g, 'undefined')}
                            </Typography>
                        </Box>
                    ))}
            </Box>
            <Box mb={1}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {translate('value_preview_description')}
                </Typography>
            </Box>
        </Box>
    );
};

export default ValuePreview;
