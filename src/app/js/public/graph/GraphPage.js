import React from 'react';

import GraphSummary from './GraphSummary';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    sideColumn: {
        width: '25%',
        flexGrow: 1,
    },
    centerColumn: {
        width: '50%',
        flexGrow: 2,
    },
};

const PureGraph = () => (
    <div style={styles.container}>
        <div style={styles.sideColumn}>
            <GraphSummary />
        </div>
        <div style={styles.centerColumn}>graph placeholder</div>
        <div style={styles.sideColumn}>facet placeholder</div>
    </div>
);

export default PureGraph;
