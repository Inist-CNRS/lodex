import { WebElementCondition } from 'selenium-webdriver';

export const elementValueIs = (element, text) =>
    new WebElementCondition('until element text is', () =>
        element.getAttribute('value').then(t => (t === text ? element : null)));
