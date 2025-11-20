import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { GraphContext } from './GraphContext';

export function GraphAction({ children }: GraphActionProps) {
    const context = useContext(GraphContext);

    if (!context?.portalContainer?.current) {
        return null;
    }

    return createPortal(<>{children}</>, context.portalContainer.current);
}

export type GraphActionProps = {
    children: React.ReactNode;
};
