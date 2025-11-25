import { Box, useTheme } from '@mui/material';
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
    value: string | null;
};

export type SearchPaneContextType = {
    filter: SearchPaneFilter | null;
    setFilter: React.Dispatch<React.SetStateAction<SearchPaneFilter | null>>;
};

export function SearchPaneContextProvider({
    children,
    resultsPane,
}: SearchPaneContextProviderProps): ReactElement {
    const { pathname } = useLocation();
    const [filter, setFilter] = useState<SearchPaneFilter | null>(null);
    const theme = useTheme();

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
            <Box
                sx={{
                    marginRight: filter?.value ? '384px' : 0,
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
