export const SORT_YEAR_DESC = 'YEAR_DESC' as const;
export const SORT_YEAR_ASC = 'YEAR_ASC' as const;

export const SORT_YEAR_VALUES = [SORT_YEAR_DESC, SORT_YEAR_ASC];

export type SortYear = (typeof SORT_YEAR_VALUES)[number];

export const CUSTOM_ISTEX_QUERY = 'custom_istex_query' as const;
export const HOST_ISSN = 'host.issn' as const;
export const HOST_EISSN = 'host.eissn' as const;
export const HOST_ISBN = 'host.isbn' as const;
export const HOST_EISBN = 'host.eisbn' as const;
export const HOST_TITLE = 'host.title' as const;
export const HOST_TITLE_RAW = 'host.title.raw' as const;
export const REFBIBS_HOST_TITLE_RAW = 'refBibs.host.title.raw' as const;
export const REFBIBS_TITLE = 'refBibs.title' as const;
export const TOP_HITS = 'topHits' as const;

export const SEARCHED_FIELD_VALUES = [
    CUSTOM_ISTEX_QUERY,
    HOST_ISSN,
    HOST_EISSN,
    HOST_ISBN,
    HOST_EISBN,
    HOST_TITLE,
];

export type SearchedField = (typeof SEARCHED_FIELD_VALUES)[number];
