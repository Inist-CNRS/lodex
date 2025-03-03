export const TARGET_STEP = 'TARGET_STEP';
export const COMMENT_STEP = 'COMMENT_STEP';
export const VALUE_STEP = 'VALUE_STEP';
export const AUTHOR_STEP = 'AUTHOR_STEP';

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
