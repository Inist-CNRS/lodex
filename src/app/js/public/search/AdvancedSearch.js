import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';

import FacetList from '../facet/FacetList';

const styles = StyleSheet.create({
    container: {
        padding: '1rem',
    },
});

const AdvancedSearch = () => (
    <div className={`advanced-search ${css(styles.container)}`}>
        <FacetList page="search" />
    </div>
);

export default AdvancedSearch;
