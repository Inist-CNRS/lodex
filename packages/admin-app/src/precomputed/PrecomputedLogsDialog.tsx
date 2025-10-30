import { FixedSizeList } from 'react-window';
import { useMeasure } from 'react-use';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import CancelButton from '../../../../src/app/js/lib/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const styles = {
    info: {
        color: 'info.main',
        lineHeight: '0.8rem',
        whiteSpace: 'nowrap',
    },
    ok: {
        color: 'primary.main',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
    error: {
        color: 'error.main',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
};

interface LogLineProps {
    data: string[];
    index: number;
    style: object;
}

const LogLine = (props: LogLineProps) => {
    const { data, index, style } = props;
    const log = data[index];
    let parsedLog;
    try {
        parsedLog = JSON.parse(log);
    } catch (e) {
        console.error(`Error parsing log : "${data[index]}"`);
        return null;
    }

    const timestamp = new Date(parsedLog?.timestamp);
    let date;
    try {
        date = Intl.DateTimeFormat('fr', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(timestamp);
    } catch (e) {
        date = 'No date';
    }

    return (
        <Typography
            variant="body2"
            key={timestamp.valueOf()}
            style={style}
            // @ts-expect-error TS7053
            sx={styles[parsedLog.level]}
            title={parsedLog.message}
        >
            [{date}] {parsedLog.message}
        </Typography>
    );
};

interface PrecomputedLogsDialogProps {
    isOpen: boolean;
    handleClose(...args: unknown[]): unknown;
    logs: string[];
}

export const PrecomputedLogsDialog = ({
    isOpen,
    logs,
    handleClose,
}: PrecomputedLogsDialogProps) => {
    const { translate } = useTranslate();
    const [logsContainerRef, { width }] = useMeasure();

    const handleDownloadLogs = () => {
        const stringLogs = logs.join('\n');
        const file = new Blob([stringLogs], { type: 'text/plain' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'precomputed-logs-' + Date.now() + '.log';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>{translate('precomputed_logs')}</DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                    width: '1100px',
                    border: '1px solid',
                    borderColor: 'info.main',
                }}
                ref={logsContainerRef}
            >
                <FixedSizeList
                    height={700}
                    width={width}
                    itemSize={30}
                    itemCount={logs.length}
                    itemData={logs}
                >
                    {LogLine}
                </FixedSizeList>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <CancelButton onClick={handleClose}>
                        {translate('close')}
                    </CancelButton>
                    <Button
                        onClick={handleDownloadLogs}
                        color="primary"
                        variant="contained"
                    >
                        {translate('download_logs')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default PrecomputedLogsDialog;
