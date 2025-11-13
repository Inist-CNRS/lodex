export const TARGET_STEP = 'TARGET_STEP' as const;
export const COMMENT_STEP = 'COMMENT_STEP' as const;
export const VALUE_STEP = 'VALUE_STEP' as const;
export const AUTHOR_STEP = 'AUTHOR_STEP' as const;

export const nextStepByStep = {
    [TARGET_STEP]: null,
    [VALUE_STEP]: COMMENT_STEP,
    [COMMENT_STEP]: AUTHOR_STEP,
    [AUTHOR_STEP]: AUTHOR_STEP,
};

export const previousStepByStep = {
    [TARGET_STEP]: TARGET_STEP,
    [VALUE_STEP]: TARGET_STEP,
    [COMMENT_STEP]: TARGET_STEP,
    [AUTHOR_STEP]: COMMENT_STEP,
};

export const progressByStep = {
    [TARGET_STEP]: 25,
    [VALUE_STEP]: 50,
    [COMMENT_STEP]: 75,
    [AUTHOR_STEP]: 100,
};

export type Step =
    | typeof TARGET_STEP
    | typeof VALUE_STEP
    | typeof COMMENT_STEP
    | typeof AUTHOR_STEP;
