import MarkdownIt from 'markdown-it';
import React, { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../../propTypes';
import InvalidFormat from '../../../InvalidFormat';
import getLabel from '../../../utils/getLabel';

const markdown = new MarkdownIt();

const MarkdownModalView = ({
    className,
    resource,
    field,
    fields,
    type,
    label,
    fullScreen,
    maxWidth,
}) => {
    const [open, setOpen] = useState(false);

    const buttonLabel = useMemo(() => {
        return getLabel(field, resource, fields, type, label);
    }, [field, resource, fields, type, label]);

    const [value, content] = useMemo(() => {
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

MarkdownModalView.propTypes = {
    className: PropTypes.string,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['text', 'column']),
    label: PropTypes.string.isRequired,
    fullScreen: PropTypes.bool,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

MarkdownModalView.defaultProps = {
    className: null,
};

export default MarkdownModalView;
