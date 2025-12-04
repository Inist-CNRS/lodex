import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Box, Stack, Typography, type SxProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, {
    forwardRef,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    GraphContext,
    GraphContextProvider,
} from '../../../../public-app/src/graph/GraphContext';
import type { Field } from '../../../fields/types';
import { useTranslate } from '../../../i18n/I18NContext';

type FullScreenButtonProps = {
    fill?: string;

    open(): void;
};

function FullScreenButton({ fill, open }: FullScreenButtonProps) {
    const { translate } = useTranslate();

    return (
        <Tooltip title={translate('fullscreen')} placement="left">
            <IconButton
                onClick={open}
                sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                }}
            >
                <OpenInFullIcon
                    sx={{
                        color: fill || 'var(--text-main)',
                    }}
                />
            </IconButton>
        </Tooltip>
    );
}

type FullScreenHeadingProps = {
    field?: Field | undefined;

    close(): void;
};

const FullScreenHeading = forwardRef<HTMLDivElement, FullScreenHeadingProps>(
    ({ field, close }: FullScreenHeadingProps, ref) => {
        const { translate } = useTranslate();
        return (
            <Stack
                direction="row"
                sx={{
                    height: '3rem',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                {field && (
                    <Typography
                        sx={{
                            color: 'grey.500',
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                        }}
                    >
                        {field.label}
                    </Typography>
                )}
                <Stack
                    flex="1"
                    direction="row"
                    gap="0.5rem"
                    justifyContent="flex-end"
                    ref={ref}
                />

                <IconButton
                    aria-label={translate('close')}
                    onClick={close}
                    sx={{
                        color: 'var(--text-main)',
                        backgroundColor: 'rgba(0,0,0,0.025)',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
        );
    },
);

type FormatFullScreenModeProps = {
    children: React.ReactNode;
    fill?: string;

    // Some graphs do not resize well when entering fullscreen mode.
    // This option forces a re-render when toggling fullscreen mode.
    // Default: false
    forceRerenderOnToggle?: boolean;
};

const FormatFullScreenMode = ({
    children,
    fill,
    forceRerenderOnToggle: forceRerenderOnOpen = false,
}: FormatFullScreenModeProps) => {
    const [key, setKey] = useState(Math.random());
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const externalContext = useContext(GraphContext);
    const graphActionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (forceRerenderOnOpen) {
            setKey(Math.random());
        }

        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 100);
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open, forceRerenderOnOpen]);

    if (!externalContext) {
        return children;
    }

    const modalStyles: SxProps = open
        ? {
              position: 'absolute',
              gap: '1rem',
              padding: '1rem',
          }
        : {
              gap: 0,
              paddong: 0,
          };

    const fieldStyles: SxProps = open
        ? {
              borderRadius: '0.25rem',
              paddingInline: '0rem',
              margin: 0,
              overflow: 'auto',
          }
        : {
              border: 0,
          };

    return (
        <GraphContextProvider
            {...externalContext}
            portalContainer={
                open ? graphActionRef : externalContext?.portalContainer
            }
        >
            <Stack
                sx={{
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    zIndex: open ? 9999 : 'initial',
                    position: open ? 'absolute' : 'relative',
                    backgroundColor: open ? 'var(--background-paper)' : 'none',
                    ...modalStyles,
                }}
            >
                {open && (
                    <FullScreenHeading
                        ref={graphActionRef}
                        field={externalContext?.field}
                        close={handleClose}
                    />
                )}

                <Box
                    component="fieldset"
                    sx={{
                        position: 'relative',
                        flexGrow: 1,
                        width: '100%',
                        maxWidth: '100%',
                        minWidth: '100%',
                        ...fieldStyles,
                    }}
                    key={key}
                >
                    {children}

                    {!open && (
                        <FullScreenButton open={handleOpen} fill={fill} />
                    )}
                </Box>
            </Stack>
        </GraphContextProvider>
    );
};

export default FormatFullScreenMode;
