import { useEffect, useRef, useState } from 'react';
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
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';

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
    // set when logged in
    progressRequest?: { url: string } | null;
    p?: unknown;
}

export const ProgressComponent = (props: ProgressComponentProps) => {
    const { translate } = useTranslate();
    const { clearProgress, loadProgress, progress, progressRequest } = props;

    const [updatedProgress, setUpdatedProgress] = useState(progress);
    const isOpen =
        updatedProgress.status !== ProgressStatus.PENDING &&
        !updatedProgress.isBackground;

    const socketEventCount = useRef(0);

    // @ts-expect-error TS2345
    useEffect(() => {
        const socket = io();
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        // log all messages
        socket.on(`${tenant}-progress`, (data) => {
            socketEventCount.current++;
            setUpdatedProgress(data);
        });
        socket.on(`${tenant}-connect_error`, () => {
            loadProgress();
        });
        return () => socket.disconnect();
    }, []);

    // the socket only tells what changes: a job already running when the page
    // loads (or after a new login) would stay hidden until its next event
    const isLoggedIn = !!progressRequest;
    useEffect(() => {
        if (!progressRequest) {
            return;
        }
        let isStale = false;
        const eventCount = socketEventCount.current;
        fetch(progressRequest).then(
            // @ts-expect-error TS7031
            ({ response }) => {
                // a socket event received meanwhile is newer
                if (
                    response &&
                    !isStale &&
                    eventCount === socketEventCount.current
                ) {
                    setUpdatedProgress(response);
                }
            },
        );
        return () => {
            isStale = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

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
    progressRequest: fromUser.getToken(state)
        ? fromUser.getProgressRequest(state)
        : null,
});

const mapDispatchToProps = {
    loadProgress,
    clearProgress,
};

export const Progress = compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(ProgressComponent);
