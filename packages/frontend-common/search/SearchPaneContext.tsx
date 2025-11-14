import {
    createContext,
    useEffect,
    useMemo,
    useState,
    type ReactElement,
    type ReactNode,
} from 'react';
import { useLocation } from 'react-router';

export const SearchPaneContext = createContext<
    SearchPaneContextType | undefined
>(undefined);

export type SearchPaneFilter = {
    field: string;
    value: string;
};

export type SearchPaneContextType = {
    filter: SearchPaneFilter | null;
    setFilter(filter: SearchPaneFilter | null): void;
};

export function SearchPaneContextProvider({
    children,
    resultsPane,
}: SearchPaneContextProviderProps): ReactElement {
    const { pathname } = useLocation();
    const [filter, setFilter] = useState<SearchPaneFilter | null>(null);

    const contextValue = useMemo<SearchPaneContextType | undefined>(() => {
        return {
            filter,
            setFilter,
        };
    }, [filter]);

    useEffect(() => {
        setFilter(null);
    }, [pathname]);

    return (
        <SearchPaneContext.Provider value={contextValue}>
            {children}
            {resultsPane}
        </SearchPaneContext.Provider>
    );
}

export type SearchPaneContextProviderProps = {
    children: ReactNode;
    resultsPane: ReactElement;
};
