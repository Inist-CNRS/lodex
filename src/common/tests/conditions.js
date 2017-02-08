import { WebElementCondition } from 'selenium-webdriver';

export const elementValueIs = (element, text) =>
    new WebElementCondition('until element text is', () =>
        element.getAttribute('value').then(t => (t === text ? element : null)));

export const elementIsClickable = element =>
    new WebElementCondition('until element is clickable', () => (
        element.isDisplayed() && element.isEnabled() ? element : null
    ));
