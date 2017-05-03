import { Condition } from 'selenium-webdriver';

export const inputElementIsFocusable = element => // eslint-disable-line
    new Condition('until element is focusable', async () => {
        const [isDisplayed, isEnabled, tagName] = await Promise.all([
            element.isDisplayed(),
            element.isEnabled(),
            element.getTagName(),
        ]);

        if (!['input', 'textarea'].includes(tagName.toLowerCase())) {
            throw new Error('Invalid element: must be an input or a textarea');
        }

        if (!isDisplayed || !isEnabled) return false;

        return true;
    });
