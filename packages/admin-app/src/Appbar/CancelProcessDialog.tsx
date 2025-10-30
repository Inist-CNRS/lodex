import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import CancelButton from '../../../../src/app/js/lib/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface CancelProcessDialogProps {
    title: string;
    content: string;
    onConfirm(...args: unknown[]): unknown;
    onCancel(...args: unknown[]): unknown;
    isOpen: boolean;
}

const CancelProcessDialog = (props: CancelProcessDialogProps) => {
    const { isOpen, title, content, onConfirm, onCancel } = props;
    const { translate } = useTranslate();
    return (
        <Dialog open={isOpen}>
            <DialogTitle>{translate(title)}</DialogTitle>
            <DialogContent>{translate(content)}</DialogContent>
            <DialogActions>
                <CancelButton onClick={onCancel}>
                    {translate('Cancel')}
                </CancelButton>
                <Button color="primary" variant="contained" onClick={onConfirm}>
                    {translate('Accept')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelProcessDialog;
