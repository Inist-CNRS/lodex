// @ts-expect-error TS7016
import MarkdownIt from 'markdown-it';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import CloseIcon from '@mui/icons-material/Close';

import { type Field } from '../../../../propTypes';
import InvalidFormat from '../../../InvalidFormat';
import getLabel from '../../../utils/getLabel';

const markdown = new MarkdownIt();

interface MarkdownModalViewProps {
    className?: string;
    fields: Field[];
    field: Field;
    resource: object;
    type?: 'text' | 'column';
    label: string;
    fullScreen?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const MarkdownModalView = ({
    className,

    resource,

    field,

    fields,

    type,

    label,

    fullScreen,

    maxWidth,
}: MarkdownModalViewProps) => {
    const [open, setOpen] = useState(false);

    const buttonLabel = useMemo(() => {
        return getLabel(field, resource, fields, type, label);
    }, [field, resource, fields, type, label]);

    const [value, content] = useMemo(() => {
        // @ts-expect-error TS7053
        const value = resource[field.name];

        try {
            return [value, markdown.render(value)];
        } catch (e) {
            return [value, null];
        }
    }, [resource, field.name]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    if (content == null) {
        // @ts-expect-error TS18046
        return <InvalidFormat format={field.format} value={value} />;
    }

    const CustomDialog = () => {
        if (fullScreen) {
            return (
                <Dialog open={open} onClose={handleClose} fullScreen>
                    <DialogTitle>{buttonLabel}</DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'var(--text-main)',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Container maxWidth="xl">
                            <div
                                dangerouslySetInnerHTML={{ __html: content }}
                            ></div>
                        </Container>
                    </DialogContent>
                </Dialog>
            );
        }

        return (
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={maxWidth}
                fullWidth
            >
                <DialogTitle>{buttonLabel}</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'var(--text-main)',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className={className}>
            <Button onClick={handleClickOpen} variant="contained">
                {buttonLabel}
            </Button>
            <CustomDialog />
        </div>
    );
};

MarkdownModalView.defaultProps = {
    className: null,
};

export default MarkdownModalView;
