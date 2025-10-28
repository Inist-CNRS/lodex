import PreviewIcon from '@mui/icons-material/Preview';

import { Box, Typography } from '@mui/material';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

interface PrecomputedPreviewProps {
    lines: unknown[];
    sourceColumns?: string[];
}

const PrecomputedPreview = ({
    lines,
    sourceColumns,
}: PrecomputedPreviewProps) => {
    const { translate } = useTranslate();
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
                <Typography variant="body1">
                    {sourceColumns && sourceColumns.join(' | ')}
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
                                title={JSON.stringify(line)}
                            >
                                {/*
                                 // @ts-expect-error TS2769 */}
                                {Object.values(line)
                                    .map((value) =>
                                        value !== undefined
                                            ? JSON.stringify(value)
                                            : 'undefined',
                                    )
                                    .join(' | ')}
                            </Typography>
                        </Box>
                    ))}
                {lines.length === 0 && (
                    <Box textAlign={'center'} mb={2}>
                        <Typography variant="body1">
                            {translate('preview_no_data')}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Box mb={1}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {translate('precomputed_preview_description')}
                </Typography>
            </Box>
        </Box>
    );
};

export default PrecomputedPreview;
