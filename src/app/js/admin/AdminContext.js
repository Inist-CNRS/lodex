import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
    const [showEnrichmentColumn, setShowEnrichmentColumn] = React.useState(
        true,
    );
    const [showMainColumn, setShowMainColumn] = React.useState(true);

    return (
        <AdminContext.Provider
            value={{
                showEnrichmentColumn,
                showMainColumn,
                setShowEnrichmentColumn,
                setShowMainColumn,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

AdminContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error(
            'useAdminContext must be used within a AdminContextProvider',
        );
    }
    return context;
};
