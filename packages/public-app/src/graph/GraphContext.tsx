import type { Field } from '@lodex/frontend-common/fields/types';
import { createContext, useMemo } from 'react';

export type GraphContextType = {
    portalContainer: React.RefObject<Element | null>;
    field?: Field;
};

export const GraphContext = createContext<GraphContextType | undefined>(
    undefined,
);

export function GraphContextProvider({
    children,
    field,
    portalContainer,
}: GraphPortalContextProviderProps) {
    const value = useMemo(
        () => ({ portalContainer, field }),
        [portalContainer, field],
    );

    return (
        <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
    );
}

type GraphPortalContextProviderProps = {
    children: React.ReactNode;
} & GraphContextType;
