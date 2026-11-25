import { useState, type ReactNode } from 'react';
import { DropzoneAreaBase, type FileObject } from 'mui-file-dropzone';
import {
    alpha,
    Box,
    InputAdornment,
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from '@lodex/common';
import SourceCodeField from '@lodex/frontend-common/components/SourceCodeField';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

import type { DatasetSource } from './uploadDataset';
import { isHttpUrl } from './isHttpUrl';

// the dropzone look: dashed frame, icon above its text
const dropzoneFrame = {
    border: '2px dashed',
    borderColor: 'grey.400',
    borderRadius: 2,
    bgcolor: 'action.hover',
    '&:hover': { borderColor: 'primary.main' },
};
const iconAboveText = {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
};

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
            padding: '0.5rem 1rem',
            overflowY: 'auto',
            ...dropzoneFrame,
        },
        // centered by auto margins, which fall to zero once the content is
        // taller than the dropzone: it then scrolls from its top (unlike
        // justify-content: center, and 'safe center' needs Safari 17.6)
        '& .dropzoneTextContainer': { mt: 'auto', ...iconAboveText, gap: 1 },
        '& .dropzone > :last-child': { mb: 'auto' },
        // the file name must fit below the text (13" screens)
        '& .dropzoneText': { my: 1 },
        '& .dropzoneIcon': { width: 36, height: 36, color: 'primary.main' },
        '& .droppingLoader': { minHeight: '120px', ...dropzoneFrame },
    },
    // the chosen file's chip takes the place of the upload icon
    compactFormWithFile: {
        '& .dropzoneIcon': { display: 'none' },
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
        flex: 1,
        minHeight: '220px',
        backgroundColor: 'var(--contrast-main)',
        color: 'var(--primary-secondary)',
    },
    // a narrow column: the input takes its whole width, and the height left
    // by its parent (a flex column), the same from a tab to the other
    narrowForm: {
        flex: 1,
        margin: 0,
        alignItems: 'stretch',
        '& .dropzone': {
            flex: 1,
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 1rem',
            ...dropzoneFrame,
        },
        // the file inspection takes the dropzone's place, at its size
        '& .droppingLoader': { minHeight: '160px', ...dropzoneFrame },
        // centered by auto margins, as in compactForm
        '& .dropzoneTextContainer': { mt: 'auto', ...iconAboveText, gap: 2 },
        '& .dropzone > :last-child': { mb: 'auto' },
        '& .dropzoneText': { margin: 0 },
        '& .dropzoneIcon': { width: 56, height: 56, color: 'primary.main' },
    },
    browse: {
        color: 'primary.main',
        textDecoration: 'underline',
    },
    narrowTextInput: {
        width: '100%',
        flex: 1,
        minHeight: '160px',
    },
    // the url field framed like the dropzone, so the height stays the same
    // from a tab to the other
    urlPanel: {
        flex: 1,
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // centered like the dropzone text, so a tall panel does not look empty
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        paddingX: 4,
        paddingY: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'action.hover',
        '& .MuiInputBase-root': { bgcolor: 'background.paper' },
        '& .MuiTextField-root': { maxWidth: 640, textAlign: 'left' },
    },
    // the wizard has little height: no icon, tighter, centered by auto
    // margins so that an overflow scrolls from the top (as compactForm)
    compactUrlPanel: {
        minHeight: '120px',
        justifyContent: 'flex-start',
        gap: 1.5,
        paddingY: 2,
        overflowY: 'auto',
        '& > :first-child': { mt: 'auto' },
        '& > :last-child': { mb: 'auto' },
    },
    urlIcon: {
        display: 'grid',
        placeItems: 'center',
        width: 56,
        height: 56,
        borderRadius: '50%',
        color: 'primary.main',
        bgcolor: 'background.paper',
        '& svg': { fontSize: 32 },
    },
    urlValid: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color: 'success.main',
    },
    dropzone: {
        minHeight: '220px',
        padding: '0 1rem',
    },
    disabledDropzone: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    // ace keeps a placeholder on one line: a long example (a query url) wraps.
    // ace also shrinks and dims it, and gives it the comment color: hard to
    // read on the dark editor. The text color, in italics to tell it from a
    // typed text
    textPlaceholder: {
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        transform: 'none',
        opacity: 1,
        color: '#F8F8F2',
        fontStyle: 'italic',
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
            className="droppingLoader"
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
    // shown in the free input while it is empty
    textPlaceholder?: string;
    // hides the per-tab descriptions, which tell the user to choose a loader
    hideDescriptions?: boolean;
    // the tabs offered, in this order (all by default)
    tabs?: DatasetSourceTab[];
    // the translation key of the line below the dropzone text (the accepted
    // formats and the size limit by default)
    fileHintKey?: string;
    // rendered between the tabs and the form, e.g. an error message
    children?: ReactNode;
    // for a dialog with little height: small tabs, and the input fills the
    // height left by its parent (a flex column)
    compact?: boolean;
    // for a narrow column: small tabs, and the input takes the column width
    narrow?: boolean;
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
    textPlaceholder,
    hideDescriptions = false,
    tabs = TABS,
    fileHintKey = 'upload_formats_limit',
    children,
    compact = false,
    narrow = false,
}: DatasetSourceInputProps) => {
    const smallTabs = compact || narrow;
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
                <Box sx={smallTabs ? styles.compactTabs : styles.tabs}>
                    <Tabs
                        value={tab}
                        onChange={(_: unknown, value: DatasetSourceTab) =>
                            onTabChange(value)
                        }
                        variant={smallTabs ? 'standard' : 'fullWidth'}
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
                    // more specific than the theme's `.ace-monokai .ace_comment`
                    '& .ace_editor .ace_placeholder': styles.textPlaceholder,
                    ...(narrow ? styles.narrowForm : {}),
                    ...(compact ? styles.compactForm : {}),
                    ...(compact && files.length > 0
                        ? styles.compactFormWithFile
                        : {}),
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
                                            component="span"
                                            display="block"
                                            fontSize={compact ? 16 : 18}
                                            fontWeight={600}
                                        >
                                            {translate('upload_drop_file')}{' '}
                                            <Box
                                                component="span"
                                                sx={styles.browse}
                                            >
                                                {translate('upload_browse')}
                                            </Box>
                                        </Typography>
                                        <Typography
                                            component="span"
                                            display="block"
                                            fontSize={compact ? 14 : 15}
                                            color="text.secondary"
                                            mt={compact ? 0.5 : 1}
                                        >
                                            {translate(fileHintKey, {
                                                // @ts-expect-error TS2322
                                                limit: UPLOAD_LIMIT,
                                            })}
                                        </Typography>
                                    </>
                                }
                                dropzoneProps={{
                                    disabled: !!url,
                                }}
                                dropzoneClass={`dropzone ${
                                    !!url && 'disabledDropzone'
                                }`}
                                classes={{
                                    textContainer: 'dropzoneTextContainer',
                                    text: 'dropzoneText',
                                    icon: 'dropzoneIcon',
                                }}
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
                        {narrow || compact ? (
                            <Box
                                sx={{
                                    ...styles.urlPanel,
                                    ...(compact ? styles.compactUrlPanel : {}),
                                }}
                            >
                                {!compact && (
                                    <Box sx={styles.urlIcon}>
                                        <LinkIcon />
                                    </Box>
                                )}
                                <Typography variant="h6" component="p">
                                    {translate('upload_url_title')}
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={url}
                                    onChange={(e) =>
                                        onUrlChange(e.target.value)
                                    }
                                    placeholder="https://"
                                    error={!!url && !isUrlValid}
                                    helperText={
                                        // a space keeps the line when empty: the
                                        // centered field does not move on typing
                                        !url ? (
                                            ' '
                                        ) : isUrlValid ? (
                                            <Box
                                                component="span"
                                                sx={styles.urlValid}
                                            >
                                                <CheckCircleIcon fontSize="inherit" />
                                                {translate('upload_url_valid')}
                                            </Box>
                                        ) : (
                                            translate('invalid_url')
                                        )
                                    }
                                    disabled={!!files.length}
                                    label={translate('use_url')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LinkIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        ) : (
                            <TextField
                                fullWidth
                                sx={styles.input}
                                value={url}
                                onChange={(e) => onUrlChange(e.target.value)}
                                placeholder="URL"
                                error={!!url && !isUrlValid}
                                helperText={
                                    url &&
                                    !isUrlValid &&
                                    translate('invalid_url')
                                }
                                disabled={!!files.length}
                                label={translate('use_url')}
                                variant="standard"
                            />
                        )}
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
                                    : narrow
                                      ? styles.narrowTextInput
                                      : styles.textInput
                            }
                            // the free input is not always JSON: as JSON, the
                            // "//" of a pasted query URL starts a dim comment
                            mode="text"
                            placeholder={textPlaceholder}
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
