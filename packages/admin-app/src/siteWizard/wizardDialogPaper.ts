// The site wizard keeps one size: nothing jumps from a step to the next.
// A long step scrolls. High enough for the data step of a model with a
// help text (HAL2LODEX) to show its dropzone on 1280×720.
export const WIZARD_DIALOG_PAPER_PROPS = {
    sx: { height: 'min(560px, 90vh)', p: 4 },
};

// The progress dialog keeps one size too, high enough for every step, the
// launch counters and a Retry button: it does not grow while the generation
// runs. The wizard takes it on as soon as it shows the upload, the start of
// that same progress. A longer content scrolls.
export const GENERATION_DIALOG_PAPER_PROPS = {
    sx: { height: 'min(640px, 90vh)', p: 4 },
};
