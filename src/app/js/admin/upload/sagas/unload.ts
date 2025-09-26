export const preventUnload = () => {
    if (window && !window.onbeforeunload) {
        window.onbeforeunload = function () {
            return true;
        };
    }
};

export const allowUnload = () => {
    if (window && window.onbeforeunload) {
        window.onbeforeunload = undefined;
    }
};
