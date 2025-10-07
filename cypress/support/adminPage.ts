export const checkListOfSupportedFileFormats = () => {
    cy.get('.upload')
        .contains(
            'List of supported file formats: csv, csv-semicolon, csv-comma, tsv, tsv-double-quotes, tsv-wos, rdf, skos, json, json-conditor, json-istex, json-lodex, json-protege, rss, atom, mods, tei, xml, corpus, zip',
        )
        .should('be.visible');
};
