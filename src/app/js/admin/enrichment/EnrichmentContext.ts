import React from 'react';

export const EnrichmentContext = React.createContext({
    isEdit: false,
    enrichment: null,
    handleLaunchEnrichment: () => {},
    handleDeleteEnrichment: () => {},
    onLoadEnrichments: () => {},
});
