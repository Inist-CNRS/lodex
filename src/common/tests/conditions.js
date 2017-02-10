import { WebElementCondition } from 'selenium-webdriver';

export const elementValueIs = (element, text) =>
    new WebElementCondition('until element text is', () =>
        element.getAttribute('value').then(t => (t === text ? element : null)));

export const inputElementIsFocusable = element =>
    new WebElementCondition('until element is focusable', async () => {
        const [isDisplayed, isEnabled, tagName] = await Promise.all([
            element.isDisplayed(),
            element.isEnabled(),
            element.getTagName(),
        ]);

        if (tagName.toLowerCase() !== 'input' && tagName.toLowerCase() !== 'textarea') {
            throw new Error('Invalid element: must be an input or a textarea');
        }

        if (!isDisplayed || !isEnabled) return null;

        return element
                .sendKeys('')
                .then(() => element)
                .catch(() => null);
    });

export const elementIsClicked = element =>
    new WebElementCondition('until element is clicked', async () => {
        const [isDisplayed, isEnabled] = await Promise.all([
            element.isDisplayed(),
            element.isEnabled(),
        ]);

        if (!isDisplayed || !isEnabled) return null;

        return element
                .click()
                .then(() => element)
                .catch(() => null);
    });
