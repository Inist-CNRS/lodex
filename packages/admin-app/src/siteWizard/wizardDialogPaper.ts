// The site wizard keeps one size: nothing jumps from a step to the next.
// A long step scrolls.
const WIZARD_DIALOG_HEIGHT = 'min(480px, 90vh)';

export const WIZARD_DIALOG_PAPER_PROPS = {
    sx: { height: WIZARD_DIALOG_HEIGHT, p: 4 },
};

// The progress dialog that follows starts at the wizard's size, but grows
// with its launch and publication steps, which hold the Retry button when
// they fail: they must not hide below the fold.
export const GENERATION_DIALOG_PAPER_PROPS = {
    sx: { minHeight: WIZARD_DIALOG_HEIGHT, p: 4 },
};
