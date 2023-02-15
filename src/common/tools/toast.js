import { toast as reactToast } from 'react-toastify';

export const toast = (message, options) => {
    if (options?.type === reactToast.TYPE.ERROR) {
        options = {
            ...options,
            autoClose: false,
        };
    }
    reactToast(message, options);
};

toast.TYPE = reactToast.TYPE;
