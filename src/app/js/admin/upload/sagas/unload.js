export const preventUnload = () => {
    if (global.window && !global.window.onbeforeunload) {
        global.window.onbeforeunload = function() {
            return true;
        };
    }
};

export const allowUnload = () => {
    if (global.window && global.window.onbeforeunload) {
        global.window.onbeforeunload = undefined;
    }
};
