import { Box, useTheme } from '@mui/material';
import isEqual from 'lodash/isEqual';
import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactElement,
    type ReactNode,
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { fromFacet } from '../../public-app/src/selectors';

export const SearchPaneContext = createContext<
    SearchPaneContextType | undefined
>(undefined);

export type FieldFilter = {
    fieldName: string;
    value: string | string[] | null;
    label?: string;
};

export type SearchPaneFilter = FieldFilter[];

export type SearchPaneContextType = {
    filters: SearchPaneFilter;
    selectOne(filter: FieldFilter): void;
    selectMany(filters: FieldFilter[]): void;
    clearFilters(): void;
};

const defaultFilters: SearchPaneFilter = [];

export function SearchPaneContextProvider({
    children,
    resultsPane,
}: SearchPaneContextProviderProps): ReactElement {
    const { pathname } = useLocation();
    const [filters, setFilters] = useState<SearchPaneFilter>(defaultFilters);
    const theme = useTheme();

    const facets: Record<
        string,
        { value: string; count: number; id: string }[]
    > = useSelector(fromFacet('dataset').getAppliedFacets);

    useEffect(() => {
        setFilters([]);
    }, [facets]);

    const handleClear = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const handleSelectOne = useCallback(
        (filter: FieldFilter) => {
            if (
                filters.length === 1 &&
                filters[0].fieldName === filter.fieldName &&
                isEqual(filters[0].value, filter.value)
            ) {
                setFilters(defaultFilters);
            } else {
                setFilters([filter]);
            }
        },
        [filters],
    );

    const handleSelectMany = useCallback((filters: FieldFilter[]) => {
        setFilters(filters);
    }, []);

    const contextValue = useMemo<SearchPaneContextType | undefined>(() => {
        return {
            filters,
            selectOne: handleSelectOne,
            selectMany: handleSelectMany,
            clearFilters: handleClear,
        };
    }, [filters, handleSelectOne, handleSelectMany, handleClear]);

    useEffect(() => {
        setFilters(defaultFilters);
    }, [pathname]);

    return (
        <SearchPaneContext.Provider value={contextValue}>
            <Box
                sx={{
                    marginRight: filters?.length ? '384px' : 0,
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                {children}
            </Box>
            {resultsPane}
        </SearchPaneContext.Provider>
    );
}

export type SearchPaneContextProviderProps = {
    children: ReactNode;
    resultsPane: ReactElement;
};
