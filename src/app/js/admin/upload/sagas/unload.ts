export const preventUnload = () => {
    if (window && !window.onbeforeunload) {
        window.onbeforeunload = function () {
            return true;
        };
    }
};

export const allowUnload = () => {
    if (window && window.onbeforeunload) {
        // @ts-expect-error TS2322
        window.onbeforeunload = undefined;
    }
};
