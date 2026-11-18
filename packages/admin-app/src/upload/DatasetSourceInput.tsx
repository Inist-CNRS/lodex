import { useState, type ReactNode } from 'react';
import { DropzoneAreaBase, type FileObject } from 'mui-file-dropzone';
import {
    alpha,
    Box,
    type Theme,
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
    // a segmented choice: small, framed, the chosen one tinted
    compactTabs: {
        alignSelf: 'flex-start',
        marginBottom: '12px',
        '& .MuiTabs-root': {
            minHeight: 0,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
        },
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTab-root': {
            minHeight: 0,
            py: 0.75,
            px: 1.75,
            fontSize: 13,
        },
        '& .MuiTab-root + .MuiTab-root': {
            borderLeft: 1,
            borderColor: 'divider',
        },
        '& .MuiTab-root.Mui-selected': {
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
        },
    },
    // the input takes the height left; a short dialog scrolls below it
    compactForm: {
        flex: 1,
        minHeight: '96px',
        margin: 0,
        alignItems: 'stretch',
        '& .dropzone': {
            flex: 1,
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 1rem',
        },
    },
    // a query fits on a few lines: smaller than the dropzone and its text
    compactTextInput: {
        width: '100%',
        flex: 1,
        minHeight: '96px',
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
    // the tabs offered, in this order (all by default)
    tabs?: DatasetSourceTab[];
    // the translation key of the dropzone text
    fileTextKey?: string;
    // rendered between the tabs and the form, e.g. an error message
    children?: ReactNode;
    // for a dialog with little height: small tabs, and the input fills the
    // height left by its parent (a flex column)
    compact?: boolean;
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

const TAB_ICONS = {
    file: <UploadFileIcon />,
    url: <LinkIcon />,
    text: <EditNoteIcon />,
};

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
    tabs = TABS,
    fileTextKey = 'import_file_text',
    children,
    compact = false,
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
            {/* Tabs selector use to select the import type, useless for a single one */}
            {tabs.length > 1 && (
                <Box sx={compact ? styles.compactTabs : styles.tabs}>
                    <Tabs
                        value={tab}
                        onChange={(_: unknown, value: DatasetSourceTab) =>
                            onTabChange(value)
                        }
                        variant={compact ? 'standard' : 'fullWidth'}
                    >
                        {tabs.map((value) => (
                            <Tab
                                key={value}
                                value={value}
                                icon={TAB_ICONS[value]}
                                iconPosition="start"
                                label={translate(`upload_by_${value}`)}
                            />
                        ))}
                    </Tabs>
                </Box>
            )}

            {children}

            {/* Display tabs content */}
            <Box
                sx={{
                    ...styles.form,
                    // without the tabs, leave room for the outlined label of the first field
                    ...(tabs.length > 1 ? {} : { paddingTop: 1 }),
                    '& .dropzone': styles.dropzone,
                    '& .disabledDropzone': styles.disabledDropzone,
                    '& .dropzonePreview': styles.dropzonePreview,
                    ...(compact ? styles.compactForm : {}),
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
                                            {translate(fileTextKey)}
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
                            style={
                                compact
                                    ? styles.compactTextInput
                                    : styles.textInput
                            }
                            mode="json"
                            // the free input is not always JSON (e.g. a query URL): no syntax error cross
                            setOptions={{ useWorker: false }}
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
