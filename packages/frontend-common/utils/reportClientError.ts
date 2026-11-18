import { DEFAULT_TENANT } from '@lodex/common';

const MAX_REPORTS_PER_PAGE = 20;
// Browser extensions and cross-origin scripts produce errors we cannot fix
const IGNORED = /(chrome|moz|safari(-web)?)-extension:\/\/|^Script error\.?$/;

const reported = new Set<string>();

const stringify = (value: unknown) => {
    try {
        return JSON.stringify(value) ?? String(value);
    } catch {
        return String(value); // circular structure
    }
};

// Rejections are not always Errors (fetch responses, saga payloads, undefined)
export const describeError = (error: unknown) => {
    if (error instanceof Error) {
        return { message: error.message || error.name, stack: error.stack };
    }
    if (typeof error === 'string') {
        return { message: error };
    }
    const message = (error as { message?: unknown } | null)?.message;
    return {
        message:
            typeof message === 'string' && message ? message : stringify(error),
    };
};

export const reportClientError = (source: string, error: unknown) => {
    const described = describeError(error);
    // stay under the api body limit (10kb)
    const message = described.message.slice(0, 1000);
    const stack = (described.stack ?? '').slice(0, 4000);
    const key = `${message}\n${stack}`;

    if (
        reported.has(key) ||
        reported.size >= MAX_REPORTS_PER_PAGE ||
        IGNORED.test(message) ||
        IGNORED.test(stack)
    ) {
        return;
    }
    reported.add(key);

    fetch('/api/client-errors', {
        method: 'POST',
        keepalive: true, // the report survives a page unload
        headers: {
            'Content-Type': 'application/json',
            'X-Lodex-Tenant':
                sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT,
        },
        body: JSON.stringify({
            source,
            message,
            stack,
            url: window.location.href,
        }),
    }).catch(() => {});
};

export const installClientErrorReporter = () => {
    window.addEventListener('error', (event) =>
        reportClientError('window.onerror', event.error ?? event.message),
    );
    window.addEventListener('unhandledrejection', (event) =>
        reportClientError('unhandledrejection', event.reason),
    );
};
