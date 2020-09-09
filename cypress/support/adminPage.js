export const checkListOfSupportedFileFormats = () => {
    cy.get('.upload')
        .contains(
            'List of supported file formats: csv, csv-semicolon, csv-comma, tsv, tsv-double-quotes, tsv-wos, rdf, skos, json, json-istex, json-lodex, ini, atom, mods, tei, xml, corpus, zip',
        )
        .should('be.visible');
};
