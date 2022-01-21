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
                toggleShowEnrichmentColumns: () =>
                    setShowEnrichmentColumn(!showEnrichmentColumn),
                toggleShowMainColumns: () => setShowMainColumn(!showMainColumn),
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
    return useContext(AdminContext);
};
