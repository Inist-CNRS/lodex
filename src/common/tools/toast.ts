import { toast as reactToast, type ToastOptions } from 'react-toastify';

export const toast = (
    message: string,
    options: ToastOptions<unknown> | undefined,
) => {
    if (options?.type === 'error') {
        options = {
            ...options,
            autoClose: false,
            style: {
                display: 'inline-flex',
                minWidth: 'calc(var(--toastify-toast-width) - 8px)',
            },
        };
    }
    reactToast(message, options);
};
