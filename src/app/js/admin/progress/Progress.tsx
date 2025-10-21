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
import { PENDING } from '../../../../common/progressStatus';
import { io } from 'socket.io-client';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { translate } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const formatProgress = (progress, target, symbol, label) => {
    const formatedTarget = target ? ` / ${target}` : ``;
    const formatedSymbol = symbol ? ` ${symbol}` : ``;
    const formatedLabel = label ? ` ${label}` : ``;
    return progress + formatedTarget + formatedSymbol + formatedLabel;
};

// @ts-expect-error TS7006
const renderProgressText = (props) => {
    const { progress, target, symbol, label, p: polyglot } = props;
    if (!progress) {
        return null;
    }

    return (
        <p>
            {formatProgress(
                progress,
                target,
                symbol,
                label ? polyglot.t(label) : undefined,
            )}
        </p>
    );
};

interface ProgressComponentProps {
    progress: {
        status: string;
        target?: number;
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
    const { clearProgress, p: polyglot, loadProgress, progress } = props;

    const [updatedProgress, setUpdatedProgress] = useState(progress);
    const isOpen =
        updatedProgress.status !== PENDING && !updatedProgress.isBackground;

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
                {/*
                 // @ts-expect-error TS18046 */}
                <DialogTitle>{polyglot.t(updatedProgress.status)}</DialogTitle>
                <DialogContent>
                    {/*
                     // @ts-expect-error TS18046 */}
                    <div>{polyglot.t('progress_error')}</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen}>
            {/*
             // @ts-expect-error TS18046 */}
            <DialogTitle>{polyglot.t(updatedProgress.status)}</DialogTitle>
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
                    {renderProgressText({ ...updatedProgress, p: polyglot })}
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
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(ProgressComponent);
