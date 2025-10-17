import { useEffect, useState } from 'react';
import {
    Dialog,
    LinearProgress,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { fromProgress } from '../selectors';
import { loadProgress, clearProgress } from './reducer';
import { DEFAULT_TENANT, ProgressStatus } from '@lodex/common';
import { io } from 'socket.io-client';
import { useTranslate } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const formatProgress = (progress, target, symbol, label) => {
    const formatedTarget = target ? ` / ${target}` : ``;
    const formatedSymbol = symbol ? ` ${symbol}` : ``;
    const formatedLabel = label ? ` ${label}` : ``;
    return progress + formatedTarget + formatedSymbol + formatedLabel;
};

type ProgressTextProps = {
    progress?: number;
    target?: number | null;
    symbol?: string;
    label?: string;
};

const ProgressText = ({
    progress,
    target,
    symbol,
    label,
}: ProgressTextProps) => {
    const { translate } = useTranslate();
    if (!progress) {
        return null;
    }

    return (
        <p>
            {formatProgress(
                progress,
                target,
                symbol,
                label ? translate(label) : undefined,
            )}
        </p>
    );
};

interface ProgressComponentProps {
    progress: {
        status: string;
        target?: number | null;
        progress?: number;
        symbol?: string;
        label?: string;
        isBackground?: boolean;
        error?: boolean;
    };
    loadProgress(...args: unknown[]): unknown;
    clearProgress(...args: unknown[]): unknown;
    p?: unknown;
}

export const ProgressComponent = (props: ProgressComponentProps) => {
    const { translate } = useTranslate();
    const { clearProgress, loadProgress, progress } = props;

    const [updatedProgress, setUpdatedProgress] = useState(progress);
    const isOpen =
        updatedProgress.status !== ProgressStatus.PENDING &&
        !updatedProgress.isBackground;

    // @ts-expect-error TS2345
    useEffect(() => {
        const socket = io();
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        // log all messages
        socket.on(`${tenant}-progress`, (data) => {
            setUpdatedProgress(data);
        });
        socket.on(`${tenant}-connect_error`, () => {
            loadProgress();
        });
        return () => socket.disconnect();
    }, []);

    if (updatedProgress.error) {
        return (
            <Dialog open={isOpen} onClose={clearProgress}>
                <DialogTitle>{translate(updatedProgress.status)}</DialogTitle>
                <DialogContent>
                    <div>{translate('progress_error')}</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen}>
            <DialogTitle>{translate(updatedProgress.status)}</DialogTitle>
            <DialogContent>
                <div className="progress">
                    <LinearProgress
                        variant={
                            updatedProgress.target
                                ? 'determinate'
                                : 'indeterminate'
                        }
                        value={
                            updatedProgress.progress && updatedProgress.target
                                ? (updatedProgress.progress /
                                      updatedProgress.target) *
                                  100
                                : 0
                        }
                    />
                    <ProgressText {...updatedProgress} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    progress: fromProgress.getProgress(state),
});

const mapDispatchToProps = {
    loadProgress,
    clearProgress,
};

export const Progress = compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(ProgressComponent);
