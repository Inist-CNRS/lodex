import { Alert } from '@mui/material';
import { ErrorWithDetail } from '@lodex/frontend-common/components/ErrorWithDetail';

type GenerationErrorProps = {
    error: string;
    detail?: string | null;
};

export const GenerationError = ({ error, detail }: GenerationErrorProps) => (
    <Alert
        severity="error"
        sx={{ mb: 2, '& .MuiAlert-message': { flexGrow: 1 } }}
    >
        <ErrorWithDetail message={error} detail={detail} />
    </Alert>
);
