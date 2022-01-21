import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
    const [showEnrichmentColumns, setShowEnrichmentColumn] = React.useState(
        true,
    );
    const [showMainColumns, setShowMainColumn] = React.useState(true);

    return (
        <AdminContext.Provider
            value={{
                showEnrichmentColumns,
                showMainColumns,
                toggleShowEnrichmentColumns: () =>
                    setShowEnrichmentColumn(!showEnrichmentColumns),
                toggleShowMainColumns: () =>
                    setShowMainColumn(!showMainColumns),
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
