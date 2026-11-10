import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { DEFAULT_TENANT } from '@lodex/common';

type ImportEvent = {
    isImporting: boolean;
    success: boolean;
    message?: string;
};

export type ImportEndWait = {
    // the server only notifies connected sockets: start the import after it
    connected: Promise<void>;
    ended: Promise<void>;
};

// the socket is only open while an import end is awaited
export const useImportJobEnd = () => {
    const socketRef = useRef<Socket | null>(null);
    const rejectEndRef = useRef<((error: Error) => void) | null>(null);

    // with an error, a pending wait fails with it instead of staying pending
    const stopWaitingForImportEnd = useCallback((error?: Error) => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        const rejectEnd = rejectEndRef.current;
        rejectEndRef.current = null;
        if (error) {
            rejectEnd?.(error);
        }
    }, []);

    // a pending wait never gets its event once unmounted: fail it, so that
    // the generation still cleans up
    useEffect(
        () => () =>
            stopWaitingForImportEnd(
                new Error('site_wizard_import_interrupted'),
            ),
        [stopWaitingForImportEnd],
    );

    // fails the current wait after a delay, unless it ended meanwhile or a new
    // wait replaced it
    const giveUpWaitingForImportEnd = useCallback(
        (delay: number, error: Error) => {
            const rejectEnd = rejectEndRef.current;
            if (!rejectEnd) {
                return;
            }
            setTimeout(() => {
                if (rejectEndRef.current === rejectEnd) {
                    stopWaitingForImportEnd(error);
                }
            }, delay);
        },
        [stopWaitingForImportEnd],
    );

    const waitForImportEnd = useCallback((): ImportEndWait => {
        stopWaitingForImportEnd();
        const socket = io();
        socketRef.current = socket;
        const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;
        const dbName = sessionStorage.getItem('lodex-dbName');

        const connected = new Promise<void>((resolve, reject) => {
            socket.once('connect', () => resolve());
            socket.once('connect_error', reject);
        });

        const ended = new Promise<void>((resolve, reject) => {
            rejectEndRef.current = reject;
            socket.on(`${dbName}_${tenant}-import`, (data: ImportEvent) => {
                if (data.isImporting) {
                    return;
                }
                stopWaitingForImportEnd();
                if (data.success) {
                    resolve();
                } else {
                    reject(new Error(data.message ?? 'import_failed'));
                }
            });
        });

        return { connected, ended };
    }, [stopWaitingForImportEnd]);

    return {
        waitForImportEnd,
        stopWaitingForImportEnd,
        giveUpWaitingForImportEnd,
    };
};
