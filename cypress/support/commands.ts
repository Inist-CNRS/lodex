import '@testing-library/cypress/add-commands';

Cypress.on('window:before:load', (window) => {
    Object.defineProperty(window.navigator, 'language', { value: 'en-US' });
    Object.defineProperty(window.navigator, 'languages', { value: ['en-US'] });
});
