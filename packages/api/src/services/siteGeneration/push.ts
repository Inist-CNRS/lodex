import getLogger from '../logger';
import { getSiteGenerationView } from './siteGeneration';

type Listener = (payload: { room: string; data: unknown }) => void;

const listeners: Listener[] = [];

export const addSiteGenerationListener = (listener: Listener) =>
    listeners.push(listener);

export const removeSiteGenerationListener = (listener: Listener) => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
};

// One push at a time per tenant: each one reads the latest generation, so
// the last one sent is always the latest state
const pendingPushes = new Map<string, Promise<void>>();

// Sends the view of the generation to the admins on every change. The dialog
// polls too: a push only spares the wait, it is best effort. It matters most
// right before a task that blocks the server (its polling would then wait
// until the task ends).
export const pushSiteGeneration = (
    tenant: string,
    ctx: Parameters<typeof getSiteGenerationView>[0],
) => {
    if (!listeners.length) {
        return;
    }
    const push = (pendingPushes.get(tenant) ?? Promise.resolve())
        .then(async () => {
            const generation = await getSiteGenerationView(ctx);
            listeners.forEach((listener) =>
                listener({
                    room: `${tenant}-site-generation`,
                    data: { generation },
                }),
            );
        })
        .catch((error) => {
            getLogger(tenant).error('Site generation push error', {
                error: (error as Error).message,
            });
        })
        .finally(() => {
            if (pendingPushes.get(tenant) === push) {
                pendingPushes.delete(tenant);
            }
        });
    pendingPushes.set(tenant, push);
};
