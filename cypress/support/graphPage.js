export const checkColumnHeaders = headers => {
    headers.forEach((col, index) => {
        cy
            .get(`.dataset table thead th:nth-child(${index + 1})`)
            .contains(col)
            .should('be.visible');
    });
};
