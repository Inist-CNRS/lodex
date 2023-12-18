import { toast as reactToast } from 'react-toastify';

export const toast = (message, options) => {
    if (options?.type === reactToast.TYPE.ERROR) {
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

toast.TYPE = reactToast.TYPE;
