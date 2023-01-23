import { createContext } from 'react';

export const SidebarContext = createContext({
    open: true,
    setSidebarOpen: () => {},
});
