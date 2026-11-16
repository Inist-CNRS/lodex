import {
    toast as reactToast,
    type ToastContent,
    type ToastOptions,
} from 'react-toastify';

export const toast = (
    message: ToastContent,
    options: ToastOptions<unknown> | undefined,
) => {
    if (options?.type === 'error') {
        options = {
            ...options,
            autoClose: false,
            style: {
                display: 'inline-flex',
                minWidth: 'calc(var(--toastify-toast-width) - 8px)',
                // the close button is over the text otherwise
                paddingRight: 32,
            },
        };
    }
    reactToast(message, options);
};
