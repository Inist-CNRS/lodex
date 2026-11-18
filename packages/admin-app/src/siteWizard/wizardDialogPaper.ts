// The site wizard keeps one size: nothing jumps from a step to the next.
// A long step scrolls.
export const WIZARD_DIALOG_PAPER_PROPS = {
    sx: { height: 'min(480px, 90vh)', p: 4 },
};

// The progress dialog keeps one size too, high enough for every step, the
// launch counters and a Retry button: it does not grow while the generation
// runs. The wizard takes it on as soon as it shows the upload, the start of
// that same progress. A longer content scrolls.
export const GENERATION_DIALOG_PAPER_PROPS = {
    sx: { height: 'min(640px, 90vh)', p: 4 },
};
