import { Button, type ButtonProps } from '@mui/material';
import { useState, type MouseEvent } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import ButtonWithDialog from './ButtonWithDialog';
import CancelButton from './CancelButton';

export function ButtonWithConfirm({
    buttonLabel,
    buttonIcon,
    buttonVariant,
    dialogTitle,
    dialogContent,
    onConfirm,
}: ButtonWithConfirmProps) {
    const { translate } = useTranslate();

    const [open, setOpen] = useState(false);

    const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
        onConfirm(event);
        handleClose();
    };

    return (
        <ButtonWithDialog
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            openButton={
                <Button
                    variant={buttonVariant ?? 'contained'}
                    color="primary"
                    startIcon={buttonIcon}
                    onClick={handleOpen}
                >
                    {buttonLabel}
                </Button>
            }
            actions={
                <>
                    <CancelButton onClick={handleClose}>
                        {translate('cancel')}
                    </CancelButton>

                    <Button onClick={handleConfirm}>
                        {translate('confirm')}
                    </Button>
                </>
            }
            label={dialogTitle}
            dialog={dialogContent}
        />
    );
}

type ButtonWithConfirmProps = {
    buttonIcon?: ButtonProps['startIcon'];
    buttonVariant?: ButtonProps['variant'];
    buttonLabel: string;
    dialogTitle: string;
    dialogContent: string;
    onConfirm: (event: MouseEvent<HTMLButtonElement>) => unknown;
};
