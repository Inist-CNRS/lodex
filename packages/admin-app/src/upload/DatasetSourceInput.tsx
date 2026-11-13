import { useState, type ReactNode } from 'react';
import { DropzoneAreaBase, type FileObject } from 'mui-file-dropzone';
import {
    Box,
    TextField,
    Grid,
    CircularProgress,
    Typography,
    Tabs,
    Tab,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { toast } from '@lodex/common';
import SourceCodeField from '@lodex/frontend-common/components/SourceCodeField';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

import type { DatasetSource } from './uploadDataset';
import { isHttpUrl } from './isHttpUrl';

const styles = {
    input: {
        '@media (min-width: 992px)': {
            marginBottom: '16px',
        },
    },
    textInput: {
        width: '100%',
        height: '50vh',
    },
    tabs: {
        marginBottom: '12px',
        borderBottom: 'solid 1px #00000018',
    },
    formDesc: {
        textAlign: 'center' as const,
        marginBottom: '24px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'center',
        margin: '0 10%',
    },
    loader: {
        minHeight: '220px',
        backgroundColor: 'var(--contrast-main)',
        color: 'var(--primary-secondary)',
    },
    dropzone: {
        minHeight: '220px',
        padding: '0 1rem',
    },
    disabledDropzone: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    dropzonePreview: {
        justifyContent: 'center',
        '& .MuiGrid-item, & .MuiChip-root': {
            maxWidth: '100%',
        },
    },
};

type DroppingLoaderProps = {
    text: string;
};

const DroppingLoader = ({ text }: DroppingLoaderProps) => {
    return (
        <Grid
            sx={styles.loader}
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress />
            <span>{text}</span>
        </Grid>
    );
};

export type DatasetSourceTab = 'file' | 'url' | 'text';

export type DatasetSourceInputProps = {
    tab: DatasetSourceTab;
    onTabChange: (tab: DatasetSourceTab) => void;
    files: FileObject[];
    onFilesChange: (files: FileObject[]) => void;
    url: string;
    onUrlChange: (url: string) => void;
    text: string;
    onTextChange: (text: string) => void;
    // hides the per-tab descriptions, which tell the user to choose a loader;
    // the file size limit is then shown in the dropzone
    hideDescriptions?: boolean;
    // rendered between the tabs and the form, e.g. an error message
    children?: ReactNode;
};

export const getDatasetSource = ({
    tab,
    files,
    url,
    text,
}: Pick<
    DatasetSourceInputProps,
    'tab' | 'files' | 'url' | 'text'
>): DatasetSource | null => {
    switch (tab) {
        case 'file':
            return files.length > 0
                ? { type: 'file', file: files[0].file }
                : null;
        case 'url':
            // a selected file takes precedence over the url, as in the upload screen
            return files.length === 0 && isHttpUrl(url)
                ? { type: 'url', url }
                : null;
        case 'text':
            return text ? { type: 'text', text } : null;
        default:
            return null;
    }
};

const TABS: DatasetSourceTab[] = ['file', 'url', 'text'];

export const DatasetSourceInput = ({
    tab,
    onTabChange,
    files,
    onFilesChange,
    url,
    onUrlChange,
    text,
    onTextChange,
    hideDescriptions = false,
    children,
}: DatasetSourceInputProps) => {
    const { translate } = useTranslate();
    const [dropping, setDropping] = useState(false);
    const isUrlValid = isHttpUrl(url);

    const handleFileAdded = (list: FileObject[]) => {
        setDropping(false);
        if (!list || list.length === 0) return;

        onFilesChange([...list]);
        toast(translate('add_file_success', { name: list[0].file.name }), {
            type: 'success',
        });
    };

    return (
        <>
            {/* Tabs selector use to select the import type */}
            <Box sx={styles.tabs}>
                <Tabs
                    value={TABS.indexOf(tab)}
                    onChange={(_: unknown, index: number) =>
                        onTabChange(TABS[index])
                    }
                    variant="fullWidth"
                >
                    <Tab
                        icon={<UploadFileIcon />}
                        iconPosition="start"
                        label={translate('upload_by_file')}
                    />
                    <Tab
                        icon={<LinkIcon />}
                        iconPosition="start"
                        label={translate('upload_by_url')}
                    />
                    <Tab
                        icon={<EditNoteIcon />}
                        iconPosition="start"
                        label={translate('upload_by_text')}
                    />
                </Tabs>
            </Box>

            {children}

            {/* Display tabs content */}
            <Box
                sx={{
                    ...styles.form,
                    '& .dropzone': styles.dropzone,
                    '& .disabledDropzone': styles.disabledDropzone,
                    '& .dropzonePreview': styles.dropzonePreview,
                }}
            >
                {/* Display the content of the first tab */}
                {tab === 'file' ? (
                    <>
                        {!hideDescriptions && (
                            <p style={styles.formDesc}>
                                {translate('upload_file').replace(
                                    '$UPLOAD_LIMIT$',
                                    // @ts-expect-error TS2322
                                    UPLOAD_LIMIT,
                                )}
                            </p>
                        )}
                        {dropping ? (
                            <DroppingLoader text={translate('inspect_file')} />
                        ) : (
                            <DropzoneAreaBase
                                fileObjects={files}
                                filesLimit={1}
                                // @ts-expect-error TS2322
                                maxFileSize={UPLOAD_LIMIT * 1024 * 1024 * 1024}
                                // @ts-expect-error TS2322 --- mui component type only accept string
                                dropzoneText={
                                    <>
                                        <Typography
                                            variant="h6"
                                            component="span"
                                            display="block"
                                        >
                                            {translate('import_file_text')}
                                        </Typography>
                                        {hideDescriptions && (
                                            // the dropzone renders its text in a <p>
                                            <Typography
                                                component="span"
                                                display="block"
                                            >
                                                {translate(
                                                    'upload_size_limit',
                                                    // @ts-expect-error TS2322
                                                    { limit: UPLOAD_LIMIT },
                                                )}
                                            </Typography>
                                        )}
                                    </>
                                }
                                dropzoneProps={{
                                    disabled: !!url,
                                }}
                                dropzoneClass={`dropzone ${
                                    !!url && 'disabledDropzone'
                                }`}
                                showAlerts={['error']}
                                showPreviewsInDropzone
                                showFileNamesInPreview
                                previewGridClasses={{
                                    container: 'dropzonePreview',
                                }}
                                useChipsForPreview
                                alertSnackbarProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    },
                                }}
                                onAdd={(fileObjs) => handleFileAdded(fileObjs)}
                                onDrop={() => setDropping(true)}
                                onDropRejected={() => setDropping(false)}
                                onDelete={() => onFilesChange([])}
                            />
                        )}
                    </>
                ) : null}

                {/* Display the content of the second tab */}
                {tab === 'url' ? (
                    <>
                        {!hideDescriptions && (
                            <p style={styles.formDesc}>
                                {translate('upload_via_url')}
                            </p>
                        )}
                        <TextField
                            fullWidth
                            sx={styles.input}
                            value={url}
                            onChange={(e) => onUrlChange(e.target.value)}
                            placeholder="URL"
                            error={!!url && !isUrlValid}
                            helperText={
                                url && !isUrlValid && translate('invalid_url')
                            }
                            disabled={!!files.length}
                            label={translate('use_url')}
                            variant="standard"
                        />
                    </>
                ) : null}

                {/* Display the content of the third tab */}
                {tab === 'text' ? (
                    <>
                        {!hideDescriptions && (
                            <p style={styles.formDesc}>
                                {translate('upload_via_text')}
                            </p>
                        )}
                        <SourceCodeField
                            style={styles.textInput}
                            enableModeSelector
                            mode="json"
                            input={{
                                value: text,
                                onChange: onTextChange,
                            }}
                        />
                    </>
                ) : null}
            </Box>
        </>
    );
};
